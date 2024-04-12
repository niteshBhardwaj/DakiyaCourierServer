
export const getAwbAndOrderUtil = (count: number, awbNumber: number) => {
    const numbers = Array(count).fill(awbNumber).map((count, index) => count - index).sort((a, b) => a - b);
    const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return numbers.map(number => {
        const orderId = `${number.toString().padStart(5, '0')}`;
        return {
            orderId,
            awb: `${dateString}${orderId}`
        }
    })
  }