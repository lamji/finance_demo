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

export interface Transaction {
  amount: number;
  type: "payment" | "extra";
  date: string;
  _id: string;
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

  const processTransactionNotifications = (debt: Debt): Notification[] => {
    const notifications: Notification[] = [];

    // Only process transactions from the last 7 days
    const now = new Date();
    const recentTransactions =
      debt.transactions?.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return isAfter(transactionDate, addDays(now, -7));
      }) || [];

    recentTransactions.forEach((transaction) => {
      notifications.push({
        id: `transaction-${transaction._id}`,
        title: `New ${
          transaction.type === "payment" ? "Payment" : "Extra Payment"
        } - ${debt.bank}`,
        message: `A ${
          transaction.type === "payment" ? "payment" : "extra payment"
        } of ${transaction.amount} was recorded for your ${debt.bank} loan.`,
        timestamp: transaction.date,
        isRead: false,
        type: "payment",
      });
    });

    return notifications;
  };

  const processDebtNotifications = (debt: Debt): Notification[] => {
    const notifications: Notification[] = [];

    // 1. Process monthly payments notifications (existing)
    debt.monthly_payments.forEach((payment) => {
      const notif = convertPaymentToNotification(payment, debt);
      if (notif) notifications.push(notif);
    });

    // 2. Process transaction notifications (new)
    const transactionNotifs = processTransactionNotifications(debt);
    notifications.push(...transactionNotifs);

    // 3. Process milestone notifications (existing)
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

    // Collect all notifications from debts
    debts.forEach((d) => {
      all = all.concat(processDebtNotifications(d));
    });

    // Sort notifications by timestamp, newest first
    all.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      // Reverse the comparison to get descending order (newest first)
      return dateB.getTime() - dateA.getTime();
    });

    return all;
  };

  return { generateAllNotifications };
}
