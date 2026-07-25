#!/usr/bin/env bash
# ==========================================================
#  HostLixo Website Start Script
#  Author : Kartikplayzz
#  Version: 3.0
# ==========================================================
set -uo pipefail

# ---------- Colors & Formatting ----------
BOLD="\e[1m"
DIM="\e[2m"
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
BLUE="\e[34m"
MAGENTA="\e[35m"
CYAN="\e[36m"
WHITE="\e[37m"
RESET="\e[0m"

PRIMARY="${CYAN}${BOLD}"
SECONDARY="${BLUE}"
ACCENT="${MAGENTA}${BOLD}"
SUCCESS="${GREEN}${BOLD}"
ERROR="${RED}${BOLD}"
WARN="${YELLOW}${BOLD}"

PORT="${1:-3010}"
LOGFILE="server.log"
PIDFILE=".server.pid"

clear

# ---------- Beautiful Header ----------
echo -e "\n"
echo -e " ${PRIMARY}  _   _           _   _ _          ${RESET}"
echo -e " ${PRIMARY} | | | | ___  ___| |_| (_)_  _____ ${RESET}"
echo -e " ${PRIMARY} | |_| |/ _ \/ __| __| | \ \/ / _ \\${RESET}"
echo -e " ${PRIMARY} |  _  | (_) \__ \ |_| | |>  < (_) |${RESET}"
echo -e " ${PRIMARY} |_| |_|\___/|___/\__|_|_/_/\_\___/${RESET}"
echo -e ""
echo -e " ${SECONDARY}╭──────────────────────────────────────────────────────────╮${RESET}"
echo -e " ${SECONDARY}│${RESET}                                                          ${SECONDARY}│${RESET}"
echo -e " ${SECONDARY}│${RESET}   ${PRIMARY}🚀 HOSTLIXO NETWORK - SERVER LAUNCHER${RESET}                ${SECONDARY}│${RESET}"
echo -e " ${SECONDARY}│${RESET}   ${DIM}Crafted with ❤️ by Kartikplayzz${RESET}                        ${SECONDARY}│${RESET}"
echo -e " ${SECONDARY}│${RESET}                                                          ${SECONDARY}│${RESET}"
echo -e " ${SECONDARY}╰──────────────────────────────────────────────────────────╯${RESET}\n"


function step() {
    echo -e " ${ACCENT}➜${RESET}  ${WHITE}$1${RESET}"
}
function success() {
    echo -e " ${SUCCESS}✔${RESET}  ${GREEN}$1${RESET}"
}
function error_msg() {
    echo -e " ${ERROR}✖${RESET}  ${RED}$1${RESET}"
}
function warn() {
    echo -e " ${WARN}⚠${RESET}  ${YELLOW}$1${RESET}"
}

step "Initializing startup sequence on port ${CYAN}${PORT}${RESET}..."
sleep 0.5

# ---------- Validate port ----------
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
    error_msg "Invalid port: '${PORT}'. Must be a number between 1-65535."
    exit 1
fi

# ---------- Dependency checks ----------
for cmd in npm lsof; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        error_msg "Required command '${cmd}' not found."
        if [[ "$cmd" == "lsof" ]]; then
            warn "On Debian/Ubuntu, you can install it by running:"
            echo -e "    sudo apt-get update && sudo apt-get install -y lsof"
        fi
        exit 1
    fi
done

if [[ ! -f package.json ]]; then
    error_msg "No package.json found. Please run this script from the project root."
    exit 1
fi

# ---------- Ensure dependencies are installed ----------
if [[ ! -d node_modules ]]; then
    warn "node_modules not found."
    read -rp "$(echo -e " ${ACCENT}?${RESET}  Run 'npm install' now? [y/N]: ")" INSTALL_CONFIRM
    if [[ "$INSTALL_CONFIRM" =~ ^[Yy]$ ]]; then
        step "Installing dependencies..."
        if ! npm install; then
            error_msg "npm install failed. Aborting."
            exit 1
        fi
        success "Dependencies installed!"
    else
        error_msg "Aborting — dependencies not installed."
        exit 1
    fi
fi

# ---------- Refuse to double-start ----------
function check_port() {
    lsof -tiTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1 || ss -lptn 2>/dev/null | grep -q ":${PORT}"
}

if check_port; then
    error_msg "Port ${PORT} is already in use by another process."
    read -rp "$(echo -e " ${ACCENT}?${RESET}  Would you like to force-kill it? [y/N]: ")" KILL_CONFIRM
    if [[ "$KILL_CONFIRM" =~ ^[Yy]$ ]]; then
        step "Force-killing process on port ${PORT}..."
        sudo fuser -k "${PORT}/tcp" 2>/dev/null || true
        sleep 1
        if check_port; then
            error_msg "Failed to free port ${PORT}. Aborting."
            exit 1
        fi
        success "Port ${PORT} is now free!"
    else
        error_msg "Run ./stop.sh ${PORT} first, or choose a different port."
        exit 1
    fi
fi

step "Igniting Next.js server engines..."

# ---------- Launch ----------
export PORT
# Optimize for VPS: Limit Node to 4GB to fully utilize memory and swap space
export NODE_OPTIONS="--max-old-space-size=4096"
nohup npm start > "$LOGFILE" 2>&1 &
PID=$!
echo "$PID" > "$PIDFILE"

# ---------- Beautiful Loading Spinner ----------
frames=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
READY=0
echo -n -e " ${CYAN}⠋${RESET}  ${WHITE}Waiting for server to become active...${RESET}"

for i in {1..40}; do
    # Animate spinner
    frame="${frames[$((i % 10))]}"
    echo -n -e "\r ${CYAN}${frame}${RESET}  ${WHITE}Waiting for server to become active...${RESET}"
    
    if ! kill -0 "$PID" 2>/dev/null; then
        echo -e "\n"
        error_msg "Process exited unexpectedly! Last log lines:"
        echo -e "${DIM}"
        tail -n 10 "$LOGFILE"
        echo -e "${RESET}"
        rm -f "$PIDFILE"
        exit 1
    fi
    if lsof -tiTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
        READY=1
        break
    fi
    sleep 0.25
done

echo -e "\n"

if [[ $READY -eq 1 ]]; then
    echo -e " ${SECONDARY}╭──────────────────────────────────────────────────────────╮${RESET}"
    echo -e " ${SECONDARY}│${RESET}  ${SUCCESS}✔ WEBSITE IS LIVE!${RESET}                                      ${SECONDARY}│${RESET}"
    echo -e " ${SECONDARY}│${RESET}                                                          ${SECONDARY}│${RESET}"
    echo -e " ${SECONDARY}│${RESET}  ${DIM}🌐 Network :${RESET} ${PRIMARY}http://localhost:${PORT}${RESET}                     ${SECONDARY}│${RESET}"
    echo -e " ${SECONDARY}│${RESET}  ${DIM}💻 Process :${RESET} PID ${PID}                                   ${SECONDARY}│${RESET}"
    echo -e " ${SECONDARY}│${RESET}                                                          ${SECONDARY}│${RESET}"
    echo -e " ${SECONDARY}│${RESET}  ${DIM}You can safely close this terminal now.${RESET}                 ${SECONDARY}│${RESET}"
    echo -e " ${SECONDARY}╰──────────────────────────────────────────────────────────╯${RESET}\n"
else
    warn "Server took too long to respond, but is still running (PID ${PID})."
    warn "It might just be loading slowly. Check logs to be sure."
    echo ""
fi

echo -e " ${ACCENT}→${RESET} ${DIM}To view live logs:${RESET}  ${WHITE}tail -f ${LOGFILE}${RESET}"
echo -e " ${ACCENT}→${RESET} ${DIM}To stop the server:${RESET} ${WHITE}./stop.sh ${PORT}${RESET}\n"