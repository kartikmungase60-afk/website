"use client"
import { FormEvent, useEffect, useState, useMemo } from "react"
import { Loader2, Plus, Trash2, Server, MapPin, X, Pencil, Cpu, MemoryStick, HardDrive, Network, Gamepad2, Upload } from "lucide-react"
import { motion, AnimatePresence, Variants } from "framer-motion"

const GAME_HOSTING_TYPES = ['Minecraft Java', 'Hytale', 'Palworld', 'Minecraft', 'Hostlixo']

export default function DatabasePlansTab() {
  const [categories, setCategories] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [planTypes, setPlanTypes] = useState<any[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any | null>(null)
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [savingCategory, setSavingCategory] = useState(false)
  
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/admin/assets', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (res.ok && data.path) {
        const imgInput = document.getElementById('image-input') as HTMLInputElement
        if (imgInput) {
          imgInput.value = data.path
        }
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err) {
      alert('Upload failed')
    } finally {
      setUploadingImage(false)
    }
  }
  
  const [activeMainTab, setActiveMainTab] = useState<'Game Hosting' | 'Other Hosting'>('Game Hosting')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (isModalOpen || isCategoryModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen, isCategoryModalOpen]);

  async function fetchData() {
    setLoading(true)
    try {
      const [cRes, plRes, lRes, ptRes] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/plans'),
        fetch('/api/admin/locations'),
        fetch('/api/admin/plan-types')
      ])
      
      const cData = await cRes.json()
      const plData = await plRes.json()
      const lData = await lRes.json()
      const ptData = await ptRes.json()

      setCategories(cData.data || [])
      setPlans(plData.data || [])
      setLocations(lData.data || [])
      setPlanTypes(ptData.data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function toggleOutOfStock(plan: any) {
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: plan._id, outOfStock: !plan.outOfStock })
      })
      if (!res.ok) throw new Error("Failed to update")
      fetchData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function deletePlan(id: string) {
    if (!confirm("Are you sure you want to delete this plan?")) return
    try {
      const res = await fetch(`/api/admin/plans?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error("Failed to delete plan")
      fetchData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function handleSaveCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSavingCategory(true)
    
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      planTypeId: formData.get("planTypeId")
    }

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create category")
      }
      
      setIsCategoryModalOpen(false)
      fetchData()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSavingCategory(false)
    }
  }

  async function handleSavePlan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const selectedLocations = Array.from(formData.getAll("locations"))
    
    const payload: any = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      categoryId: formData.get("categoryId"),
      price: Number(formData.get("price")),
      currency: formData.get("currency") || "INR",
      period: formData.get("period") || "/mo",
      cpu: formData.get("cpu"),
      ram: formData.get("ram"),
      storage: formData.get("storage"),
      bandwidth: formData.get("bandwidth"),
      allocations: formData.get("allocations"),
      databases: formData.get("databases"),
      backups: formData.get("backups"),
      image: formData.get("image"),
      locations: selectedLocations,
      outOfStock: formData.get("outOfStock") === "on",
    }

    if (editingPlan) {
      payload._id = editingPlan._id
    }

    try {
      const res = await fetch('/api/admin/plans', {
        method: editingPlan ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to save")
      }
      
      setIsModalOpen(false)
      setEditingPlan(null)
      fetchData()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  function openAddModal() {
    setEditingPlan(null)
    setIsModalOpen(true)
  }

  function openEditModal(plan: any) {
    setEditingPlan(plan)
    setIsModalOpen(true)
  }

  const [activeSection, setActiveSection] = useState<string>("")
  
  const groupedPlans = useMemo(() => {
    const groups: Record<string, Record<string, Record<string, any[]>>> = {
      'Game Hosting': {},
      'Other Hosting': {}
    }
    
    plans.forEach(plan => {
      const fullCategory = categories.find(c => c._id === plan.categoryId?._id || c._id === plan.categoryId)
      const planTypeName = fullCategory?.planTypeId?.name || 'Uncategorized'
      
      const isGameHosting = GAME_HOSTING_TYPES.some(t => planTypeName.toLowerCase().includes(t.toLowerCase()))
      const mainTab = isGameHosting ? 'Game Hosting' : 'Other Hosting'
      
      const sectionName = planTypeName
      const categoryName = fullCategory?.name || 'Default'
      
      if (!groups[mainTab][sectionName]) groups[mainTab][sectionName] = {}
      if (!groups[mainTab][sectionName][categoryName]) groups[mainTab][sectionName][categoryName] = []
      
      groups[mainTab][sectionName][categoryName].push(plan)
    })
    return groups
  }, [plans, categories])

  const handleDeletePlanType = async (planTypeName: string) => {
    const pt = planTypes.find(p => p.name === planTypeName);
    if (!pt) return;
    if (!confirm(`Are you sure you want to delete the entire '${planTypeName}' section?`)) return;
    try {
      const res = await fetch(`/api/admin/plan-types?id=${pt._id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the category '${categoryName}'?`)) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${categoryId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const sectionTabs = useMemo(() => {
    const types = [...planTypes.map(pt => pt.name)]
    
    // Include any existing sections that might not have a formal PlanType object (e.g. Uncategorized)
    Object.keys(groupedPlans[activeMainTab] || {}).forEach(name => {
      if (!types.includes(name)) types.push(name)
    })
    
    return types.filter(name => {
      const isGame = GAME_HOSTING_TYPES.some(t => name.toLowerCase().includes(t.toLowerCase()))
      return activeMainTab === 'Game Hosting' ? isGame : !isGame
    }).sort()
  }, [planTypes, groupedPlans, activeMainTab])

  useEffect(() => {
    if (sectionTabs.length > 0) {
      if (!sectionTabs.includes(activeSection)) {
        setActiveSection(sectionTabs[0])
      }
    } else {
      setActiveSection("")
    }
  }, [sectionTabs, activeMainTab])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>
  if (error) return <div className="text-red-500 bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex items-center justify-center font-medium">{error}</div>

  return (
    <div className="space-y-8 relative">
      <div className="bg-[#0b0c10]/80 p-8 rounded-3xl border border-white/[0.04] shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Server className="w-5 h-5 text-primary" />
              </div>
              Plans Management
            </h2>
            <p className="text-sm text-gray-400 max-w-xl leading-relaxed">Instantly sync your cloud infrastructure plans, modify stock status, and manage deployments globally.</p>
          </div>
        </div>
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121319]/80 border border-white/5 p-3 rounded-xl mb-10 relative z-10">
          <div className="relative">
            <select 
              value={activeMainTab}
              onChange={(e) => setActiveMainTab(e.target.value as any)}
              className="appearance-none bg-[#0b0c10] border border-white/10 text-gray-300 hover:text-white px-4 py-2.5 pr-10 rounded-lg outline-none cursor-pointer focus:ring-1 focus:ring-white/20 transition-all text-sm font-medium w-full sm:w-[240px]"
            >
              <option value="Game Hosting">Game Hosting</option>
              <option value="Other Hosting">Other Hosting</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1a1b23] hover:bg-[#252630] border border-white/10 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
        </div>
        
        {/* Section Tabs */}
        {sectionTabs.length > 0 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
            <div className="flex flex-wrap gap-3">
              {sectionTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSection(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                    activeSection === tab 
                      ? 'bg-[#1a1b23] border-white/10 text-white shadow-lg' 
                      : 'bg-[#0b0c10] border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#121319]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              {planTypes.some(pt => pt.name === activeSection) && (
                <button
                  onClick={() => handleDeletePlanType(activeSection)}
                  className="flex items-center justify-center p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20"
                  title={`Delete ${activeSection} Section`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 bg-[#e5e5e5] hover:bg-white text-black px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" /> Add Plan
              </button>
            </div>
          </div>
        )}
        
        <motion.div 
          key={activeMainTab + activeSection}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8 relative z-10"
        >
          {!activeSection || !groupedPlans[activeMainTab]?.[activeSection] ? (
            <motion.div variants={itemVariants} className="text-center py-16 text-gray-500 font-medium bg-[#0d0e13] rounded-2xl border border-white/5 border-dashed">
              No plans found for {activeSection || 'this category'}.
            </motion.div>
          ) : (
            (() => {
              const sectionName = activeSection
              const categoriesObj = groupedPlans[activeMainTab][sectionName]
              const isGame = activeMainTab === 'Game Hosting'
              const accentColor = isGame ? 'text-red-500' : 'text-blue-500'
              const dotColor = isGame ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
              const borderHover = isGame ? 'hover:border-red-500/20' : 'hover:border-blue-500/20'

              return (
                <div className={`bg-[#0d0e13] border border-white/5 rounded-2xl p-6 md:p-8 relative transition-colors duration-500 ${borderHover}`}>
                  <div className={`absolute top-6 right-6 md:top-8 md:right-8 w-2 h-2 rounded-full ${dotColor}`} />
                  
                  <h3 className={`text-xs font-black uppercase tracking-[0.25em] mb-6 ${accentColor}`}>{sectionName}</h3>
                  
                  <div className="space-y-8">
                    {Object.entries(categoriesObj).map(([categoryName, categoryPlans]) => {
                      const categoryObj = categories.find(c => c.name === categoryName && (c.planTypeId?.name === activeSection || (!c.planTypeId && activeSection === 'Uncategorized')))
                      
                      return (
                      <div key={categoryName} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h4 className="text-sm font-bold text-gray-400">{categoryName}</h4>
                          {categoryObj && (
                            <button
                              onClick={() => handleDeleteCategory(categoryObj._id, categoryName)}
                              className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded transition-colors"
                              title={`Delete ${categoryName} Category`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <div className="grid gap-4">
                          {categoryPlans.map((plan) => (
                            <motion.div 
                              variants={itemVariants}
                              key={plan._id} 
                              className="group bg-[#121319] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors duration-300 flex flex-col xl:flex-row xl:items-center justify-between gap-6"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-white font-bold text-lg tracking-tight">{plan.name}</h3>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/5">
                                    {plan.currency} {plan.price}{plan.period}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
                                  <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-gray-600" />{plan.cpu || "N/A"}</span>
                                  <span className="flex items-center gap-1.5"><MemoryStick className="w-3.5 h-3.5 text-gray-600" />{plan.ram || "N/A"}</span>
                                  <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-gray-600" />{plan.storage || "N/A"}</span>
                                  <span className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-gray-600" />{plan.bandwidth || "N/A"}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4">
                                  {plan.locations?.map((l: any) => (
                                    <span key={l._id} className="text-[10px] font-bold tracking-wide uppercase bg-black/40 px-2.5 py-1 rounded-md text-gray-500 flex items-center gap-1.5 border border-white/5">
                                      <MapPin className="w-3 h-3 text-gray-600" /> {l.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toggleOutOfStock(plan)}
                                  className={`text-[10px] font-black w-[110px] text-center py-2 rounded-lg tracking-widest transition-all duration-300 uppercase`}
                                  style={!plan.outOfStock 
                                    ? { backgroundColor: 'rgba(0,255,102,0.05)', color: '#00ff66', border: '1px solid rgba(0,255,102,0.1)' } 
                                    : { backgroundColor: 'rgba(255,77,77,0.05)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.1)' }
                                  }
                                >
                                  {plan.outOfStock ? 'Out of Stock' : 'In Stock'}
                                </motion.button>
                                
                                <div className="flex items-center gap-1 border-l border-white/5 pl-3">
                                  <button
                                    onClick={() => openEditModal(plan)}
                                    className="p-2 bg-transparent text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent"
                                    title="Edit Plan"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => deletePlan(plan._id)}
                                    className="p-2 bg-transparent text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent"
                                    title="Remove Plan"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              )
            })()
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isCategoryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#0b0c10] border border-white/10 rounded-3xl w-full max-w-md max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#121319] shrink-0">
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">Add New Category</h3>
                  <p className="text-xs text-gray-400 mt-1">Create a new pricing group</p>
                </div>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 p-6" data-lenis-prevent>
                <form onSubmit={handleSaveCategory} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 ml-1">Category Name</label>
                    <input required name="name" className="w-full bg-[#121319] border border-white/5 focus:border-white/20 focus:ring-1 focus:ring-white/10 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="e.g. Budget, Premium" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 ml-1">Slug</label>
                    <input required name="slug" className="w-full bg-[#121319] border border-white/5 focus:border-white/20 focus:ring-1 focus:ring-white/10 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="e.g. budget, premium" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300 ml-1">Parent Plan Type</label>
                    <select required name="planTypeId" defaultValue="" className="w-full bg-[#121319] border border-white/5 focus:border-white/20 focus:ring-1 focus:ring-white/10 rounded-xl px-4 py-3 text-white text-sm transition-all outline-none appearance-none">
                      <option value="" disabled className="text-gray-500">Select Plan Type</option>
                      {planTypes.map(pt => (
                        <option key={pt._id} value={pt._id}>{pt.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={savingCategory}
                    className="w-full flex items-center justify-center gap-2 bg-[#e5e5e5] hover:bg-white text-black px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-sm transition-all disabled:opacity-50"
                  >
                    {savingCategory ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Category"}
                  </motion.button>
                </div>
              </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#0b0c10] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0b0c10]">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{editingPlan ? "Edit Plan Details" : "Configure New Plan"}</h3>
                  <p className="text-sm text-gray-400 mt-1">Specify technical resources and pricing information.</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 p-6 md:p-8" data-lenis-prevent>
                <form onSubmit={handleSavePlan} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Basic Info</h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Plan Name</label>
                      <input required name="name" defaultValue={editingPlan?.name} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="e.g. Starter VPS" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Slug URL</label>
                      <input required name="slug" defaultValue={editingPlan?.slug} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="e.g. starter-vps" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Category</label>
                      {(() => {
                        const modalCategories = categories.filter(c => {
                          const ptName = c.planTypeId?.name || 'Uncategorized'
                          return ptName === activeSection
                        })
                        
                        return (
                          <>
                            <select 
                              required 
                              name="categoryId" 
                              defaultValue={editingPlan?.categoryId?._id || editingPlan?.categoryId || (modalCategories.length === 1 ? modalCategories[0]._id : '')} 
                              className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all outline-none appearance-none"
                            >
                              {modalCategories.length === 0 ? (
                                <option value="" disabled className="text-gray-500">No categories found for {activeSection}</option>
                              ) : (
                                <>
                                  <option value="" disabled className="text-gray-500">Select Category</option>
                                  {modalCategories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                  ))}
                                </>
                              )}
                            </select>
                            {modalCategories.length === 0 && (
                              <p className="text-[10px] text-red-400 mt-1.5 ml-1 font-medium">Please create a category for {activeSection} first using the "+ Add Category" button.</p>
                            )}
                          </>
                        )
                      })()}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Plan Image / Icon</label>
                      <div className="flex gap-2">
                        <input id="image-input" name="image" defaultValue={editingPlan?.image} className="flex-1 bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all outline-none" placeholder="Image URL or upload" />
                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2 shrink-0">
                          {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          <span className="text-sm font-bold">Upload</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                        <button type="button" onClick={() => { const el = document.getElementById('image-input') as HTMLInputElement; if(el) el.value = ''; }} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl border border-red-500/10 transition-colors flex items-center justify-center shrink-0" aria-label="Clear image">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="space-y-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Pricing</h4>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Monthly Price</label>
                      <input required type="number" step="0.01" name="price" defaultValue={editingPlan?.price} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="e.g. 45" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-300 ml-1">Currency</label>
                        <input name="currency" defaultValue={editingPlan?.currency || "INR"} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-300 ml-1">Period</label>
                        <input name="period" defaultValue={editingPlan?.period || "/mo"} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Technical Specifications</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">CPU Cores</label>
                      <input name="cpu" defaultValue={editingPlan?.cpu} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="1 Core" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">RAM</label>
                      <input name="ram" defaultValue={editingPlan?.ram} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="1 GB" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Storage</label>
                      <input name="storage" defaultValue={editingPlan?.storage} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="20 GB NVMe" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Bandwidth</label>
                      <input name="bandwidth" defaultValue={editingPlan?.bandwidth} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="Unmetered" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Allocations</label>
                      <input name="allocations" defaultValue={editingPlan?.allocations} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="1 Allocation" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Databases</label>
                      <input name="databases" defaultValue={editingPlan?.databases} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="3 MySQL" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300 ml-1">Backups</label>
                      <input name="backups" defaultValue={editingPlan?.backups} className="w-full bg-[#121319] border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600 outline-none" placeholder="2 Backups" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Availability</h4>
                  <div className="flex overflow-x-auto gap-3 pb-2 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {locations.map(loc => {
                      const isSelected = editingPlan?.locations?.some((l: any) => (l._id || l) === loc._id)
                      return (
                        <label key={loc._id} className="relative group cursor-pointer shrink-0 snap-start min-w-[130px]">
                          <input 
                            type="checkbox" 
                            name="locations" 
                            value={loc._id} 
                            defaultChecked={isSelected}
                            className="peer sr-only"
                          />
                          <div className="w-full bg-[#121319] border border-white/5 p-3 rounded-xl flex items-center justify-center gap-2 peer-checked:bg-green-500/10 peer-checked:border-green-500/30 peer-checked:text-green-500 text-gray-400 transition-all shadow-sm">
                            <MapPin className="w-4 h-4 opacity-50 peer-checked:opacity-100 peer-checked:text-green-500" />
                            <span className="text-sm font-bold tracking-wide">{loc.name}</span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
                
                <div className="pt-8 mt-4 border-t border-white/5 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" name="outOfStock" defaultChecked={editingPlan?.outOfStock} className="peer appearance-none w-12 h-6 bg-gray-800 rounded-full cursor-pointer checked:bg-red-500/20 transition-colors border border-white/10 checked:border-red-500/30" />
                      <div className="absolute left-1 w-4 h-4 bg-gray-400 rounded-full peer-checked:bg-red-500 peer-checked:translate-x-6 transition-all duration-300 shadow-sm" />
                    </div>
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Mark as Out of Stock</span>
                  </label>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-black px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-shadow disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingPlan ? "Save Changes" : "Deploy Plan")}
                  </motion.button>
                </div>
              </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
