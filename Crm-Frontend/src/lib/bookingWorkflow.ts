import type { BookingType, PaymentStatus, AttendanceStatus, PaymentModel } from '@/types'

export class BookingWorkflowEngine {
  private bookingType: BookingType
  private paymentStatus: PaymentStatus
  private attendanceStatus: AttendanceStatus
  private paymentModel: PaymentModel

  constructor(
    bookingType: BookingType,
    paymentModel: PaymentModel,
    paymentStatus: PaymentStatus = 'Unpaid',
    attendanceStatus: AttendanceStatus = 'Booked'
  ) {
    this.bookingType = bookingType
    this.paymentModel = paymentModel
    this.paymentStatus = paymentStatus
    this.attendanceStatus = attendanceStatus

    this.validateInitialState()
  }

  private validateInitialState() {
    // Pre-Paid bookings must start with Paid status
    if (this.paymentModel === 'Pre-Paid' && this.paymentStatus === 'Unpaid') {
      throw new Error('Pre-Paid bookings must have Paid payment status')
    }

    // Walk-In bookings start at Checked_In
    if (this.bookingType === 'Walk_In' && this.attendanceStatus === 'Booked') {
      this.attendanceStatus = 'Checked_In'
    }
  }

  // CORE RULE: Cannot complete unless paid
  canTransitionToCompleted(): boolean {
    return this.paymentStatus === 'Paid' && this.attendanceStatus === 'In_Service'
  }

  // Check if checkout is required
  requiresCheckout(): boolean {
    return this.attendanceStatus === 'In_Service' && this.paymentStatus === 'Unpaid'
  }

  // Transition attendance status
  transitionAttendance(newStatus: AttendanceStatus): { success: boolean; error?: string } {
    const validTransitions: Record<AttendanceStatus, AttendanceStatus[]> = {
      Booked: ['Checked_In'],
      Checked_In: ['In_Service'],
      In_Service: ['Completed'],
      Completed: []
    }

    // Check if transition is valid
    if (!validTransitions[this.attendanceStatus].includes(newStatus)) {
      return {
        success: false,
        error: `Invalid transition: ${this.attendanceStatus} → ${newStatus}`
      }
    }

    // ENFORCE CORE RULE: Cannot complete unless paid
    if (newStatus === 'Completed' && this.paymentStatus !== 'Paid') {
      return {
        success: false,
        error: 'Cannot complete booking: Payment status must be Paid'
      }
    }

    this.attendanceStatus = newStatus
    return { success: true }
  }

  // Update payment status
  updatePaymentStatus(newStatus: PaymentStatus): void {
    this.paymentStatus = newStatus
  }

  // Get current state
  getState() {
    return {
      bookingType: this.bookingType,
      paymentStatus: this.paymentStatus,
      attendanceStatus: this.attendanceStatus,
      paymentModel: this.paymentModel,
      canComplete: this.canTransitionToCompleted(),
      requiresCheckout: this.requiresCheckout()
    }
  }

  // Auto-transition based on workflow rules
  autoTransition(): { action: string; message: string } | null {
    // If service ends and unpaid, trigger checkout
    if (this.requiresCheckout()) {
      return {
        action: 'TRIGGER_CHECKOUT',
        message: 'Service completed but unpaid. Checkout required.'
      }
    }

    // If paid and in service, allow completion
    if (this.canTransitionToCompleted()) {
      return {
        action: 'ALLOW_COMPLETE',
        message: 'Ready to mark as completed.'
      }
    }

    return null
  }

  // Get next available actions
  getAvailableActions(): string[] {
    const actions: string[] = []

    if (this.attendanceStatus === 'Booked') {
      actions.push('Check In')
    }

    if (this.attendanceStatus === 'Checked_In') {
      actions.push('Start Service')
    }

    if (this.attendanceStatus === 'In_Service') {
      if (this.paymentStatus === 'Unpaid') {
        actions.push('Process Payment')
      }
      if (this.paymentStatus === 'Paid') {
        actions.push('Complete Service')
      }
    }

    return actions
  }

  // Create workflow for Scheduled booking
  static createScheduled(paymentModel: PaymentModel): BookingWorkflowEngine {
    const paymentStatus = paymentModel === 'Pre-Paid' ? 'Paid' : 'Unpaid'
    return new BookingWorkflowEngine('Scheduled', paymentModel, paymentStatus, 'Booked')
  }

  // Create workflow for Walk-In booking
  static createWalkIn(paymentModel: PaymentModel): BookingWorkflowEngine {
    const paymentStatus = paymentModel === 'Pre-Paid' ? 'Paid' : 'Unpaid'
    return new BookingWorkflowEngine('Walk_In', paymentModel, paymentStatus, 'Checked_In')
  }
}

// Helper function to get status badge styling
export function getStatusBadge(status: AttendanceStatus | PaymentStatus) {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    // Attendance statuses
    Booked: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    Checked_In: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
    In_Service: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    Completed: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
    
    // Payment statuses
    Unpaid: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
    Paid: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' }
  }

  return styles[status] || styles.Booked
}
