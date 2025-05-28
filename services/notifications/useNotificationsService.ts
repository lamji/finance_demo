import { addDays, format, isAfter, isBefore } from "date-fns";
import { Debt, MonthlyPayment } from "../query/usegetUser";

export type NotificationType = "payment" | "reminder" | "system";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: NotificationType;
  isSelected?: boolean;
}

export function useNotificationsService() {
  const convertPaymentToNotification = (
    payment: MonthlyPayment,
    debt: Debt,
  ): Notification | null => {
    const now = new Date();
    const dueDate = new Date(payment.due_date);
    const isOverdue = isAfter(now, dueDate);
    const isPaidRecently =
      payment.status === "paid" && isAfter(now, addDays(dueDate, -7));
    const isDueSoon =
      !payment.status ||
      (payment.status === "pending" &&
        isAfter(dueDate, now) &&
        isBefore(dueDate, addDays(now, 7)));

    if (isPaidRecently) {
      return {
        id: payment._id,
        title: `Payment Completed - ${debt.bank}`,
        message: `Monthly payment of ${payment.amount} for ${debt.bank} loan was successfully processed.`,
        timestamp: payment.due_date,
        isRead: false,
        type: "payment",
      };
    } else if (isOverdue && payment.status !== "paid") {
      return {
        id: payment._id,
        title: `Overdue Payment - ${debt.bank}`,
        message: `Your monthly payment of ${payment.amount} for ${debt.bank} loan is overdue. Due date was ${format(dueDate, "MMMM d, yyyy")}.`,
        timestamp: payment.due_date,
        isRead: false,
        type: "reminder",
      };
    } else if (isDueSoon) {
      return {
        id: payment._id,
        title: `Upcoming Payment - ${debt.bank}`,
        message: `Your monthly payment of ${payment.amount} for ${debt.bank} loan is due on ${format(dueDate, "MMMM d, yyyy")}.`,
        timestamp: payment.due_date,
        isRead: false,
        type: "reminder",
      };
    }

    return null;
  };

  const processDebtNotifications = (debt: Debt): Notification[] => {
    const notifications: Notification[] = [];

    // 1. Map actual monthly_payments to notifications
    debt.monthly_payments.forEach((payment) => {
      const notif = convertPaymentToNotification(payment, debt);
      if (notif) notifications.push(notif);
    });

    // 2. Upcoming auto-payment based on the next pending due in debt.monthly_payments
    // const now = new Date();
    // const pending = debt.monthly_payments
    //   .filter((p) => p.status !== "paid")
    //   .map((p) => ({ ...p, dueDate: parseISO(p.due_date) }))
    //   .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    // if (pending.length > 0) {
    //   const next = pending[0];
    //   // If next due is within 7 days
    //   if (
    //     isAfter(next.dueDate, now) &&
    //     isBefore(next.dueDate, addDays(now, 7))
    //   ) {
    //     notifications.push({
    //       id: `next-payment-${debt._id}`,
    //       title: "Upcoming Auto-Payment",
    //       message: `Your next payment of ${next.amount} for ${debt.bank} loan is due on ${format(
    //         next.dueDate,
    //         "MMMM d, yyyy",
    //       )}.`,
    //       timestamp: next.dueDate.toISOString(),
    //       isRead: false,
    //       type: "payment",
    //     });
    //   }
    // }

    // 3. Milestones & completion (unchanged)
    const remainingPercentage = (debt.remaining_balance / debt.totalDebt) * 100;
    if (remainingPercentage <= 25 && remainingPercentage > 0) {
      notifications.push({
        id: `milestone-${debt._id}`,
        title: "Milestone Reached!",
        message: `You've paid off 75% of your ${debt.bank} loan! Keep up the great work!`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "system",
      });
    } else if (remainingPercentage === 0) {
      notifications.push({
        id: `completed-${debt._id}`,
        title: "Loan Paid Off!",
        message: `Congratulations! You've successfully paid off your ${debt.bank} loan.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "system",
      });
    }

    return notifications;
  };

  const generateAllNotifications = (debts: Debt[]): Notification[] => {
    let all: Notification[] = [];
    debts.forEach((d) => {
      all = all.concat(processDebtNotifications(d));
    });
    all.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    // dispatch(setNotifications(all));
    // console.log("Generated Notifications:", all);
    return all;
  };

  return { generateAllNotifications };
}
