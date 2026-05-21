export function formatPrice(price: number): string {
  return `¥${price.toFixed(price % 1 === 0 ? 0 : 2)}`;
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return d.toLocaleDateString("zh-CN");
}

export const CONDITION_LABELS: Record<string, string> = {
  like_new: "几乎全新",
  good: "成色不错",
  fair: "一般使用",
  used: "有明显痕迹",
};

export const STATUS_LABELS: Record<string, string> = {
  active: "在售",
  sold: "已售出",
  reserved: "已预订",
};
