function generateMerchantRef(prefix: string = 'ORDER'): string {
  const timestamp = Date.now(); // waktu sekarang (ms)
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // random 6 karakter
  return `${prefix}_${timestamp}_${randomStr}`;
}
