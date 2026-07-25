#!/usr/bin/env bash
# ==========================================================
#  HostLixo Website Stop Script
#  Author : Kartikplayzz
#  Version: 3.0
# ==========================================================
set -euo pipefail

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

FORCE=0
if [[ "${1:-}" == "-f" || "${1:-}" == "--force" ]]; then
    FORCE=1
    shift
fi
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
echo -e " ${SECONDARY}│${RESET}   ${PRIMARY}🛑 HOSTLIXO NETWORK - SERVER SHUTDOWN${RESET}                ${SECONDARY}│${RESET}"
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

if ! [[ "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
    error_msg "Invalid port: '${PORT}'"
    exit 1
fi

step "Scanning for active instances on port ${CYAN}${PORT}${RESET}..."
sleep 0.5

function check_port() {
    lsof -tiTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1 || ss -lptn 2>/dev/null | grep -q ":${PORT}"
}

if ! check_port; then
    success "No active process found on port ${PORT}. (Already stopped)"
    rm -f "$PIDFILE"
    echo ""
    exit 0
fi

if [[ $FORCE -eq 1 ]]; then
    warn "Force-kill mode initiated!"
else
    # Graceful shutdown first
    step "Sending graceful shutdown signal..."
    
    # Try PID file first
    if [[ -f "$PIDFILE" ]]; then
        PID=$(cat "$PIDFILE")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID" 2>/dev/null || true
            sleep 2
        fi
    fi
    
    # Check if graceful worked
    if ! check_port; then
        success "Website stopped gracefully!"
        rm -f "$PIDFILE"
        echo ""
        exit 0
    fi
    
    warn "Server did not shut down gracefully."
fi

# ---------- Force Kill ----------
step "Deploying forceful termination (SIGKILL)..."

if command -v fuser >/dev/null 2>&1; then
    sudo fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true
else
    # Fallback to lsof
    PIDS=$(lsof -tiTCP:"${PORT}" -sTCP:LISTEN || true)
    if [[ -n "$PIDS" ]]; then
        echo "$PIDS" | xargs -r sudo kill -9 >/dev/null 2>&1 || true
    fi
fi

sleep 1

if check_port; then
    error_msg "CRITICAL: Could not free port ${PORT}!"
    warn "You may need to manually intervene or restart the server."
    exit 1
fi

success "Port ${PORT} has been successfully cleared."
rm -f "$PIDFILE"

echo -e "\n ${SECONDARY}╭──────────────────────────────────────────────────────────╮${RESET}"
echo -e " ${SECONDARY}│${RESET}  ${SUCCESS}✔ SHUTDOWN COMPLETE${RESET}                                     ${SECONDARY}│${RESET}"
echo -e " ${SECONDARY}╰──────────────────────────────────────────────────────────╯${RESET}\n"