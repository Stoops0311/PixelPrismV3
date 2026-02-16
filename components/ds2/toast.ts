import { toast } from "sonner"

function showInfo(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 6000,
    style: { borderLeft: "4px solid #f4b964" },
  })
}

function showSuccess(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 6000,
    style: { borderLeft: "4px solid #a4f464" },
  })
}

function showError(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 6000,
    style: { borderLeft: "4px solid #e85454" },
  })
}

export { showInfo, showSuccess, showError }
