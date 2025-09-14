/**
 * 날짜 유틸리티 함수들
 */

/**
 * ISO 날짜 문자열을 YYYY-MM-DD 형식으로 변환
 * @param isoDate ISO 날짜 문자열 (예: "2025-09-06T20:39:07")
 * @returns YYYY-MM-DD 형식의 문자열 (예: "2025-02-16")
 */
export function formatToYYYYMMDD(isoDate: string): string {
  const date = new Date(isoDate)

  if (isNaN(date.getTime())) {
    throw new Error('유효하지 않은 날짜 형식입니다')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * ISO 날짜 문자열을 YYYY.MM.DD HH:mm:ss 형식으로 변환
 * @param isoDate ISO 날짜 문자열 (예: "2025-09-06T20:39:07")
 * @returns YYYY.MM.DD HH:mm:ss 형식의 문자열 (예: "2025.04.11 15:00:00")
 */
export function formatToYYYYMMDDHHMMSS(isoDate: string): string {
  const date = new Date(isoDate)

  if (isNaN(date.getTime())) {
    throw new Error('유효하지 않은 날짜 형식입니다')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Date 객체를 YYYY.MM.DD 형식으로 변환 (표시용)
 * @param date Date 객체
 * @returns YYYY.MM.DD 형식의 문자열 (예: "2025.09.06")
 */
export function formatToDisplayDate(date: Date): string {
  if (isNaN(date.getTime())) {
    throw new Error('유효하지 않은 날짜입니다')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환 (API용)
 * @param date Date 객체
 * @returns YYYY-MM-DD 형식의 문자열 (예: "2025-09-06")
 */
export function formatToAPIDate(date: Date): string {
  if (isNaN(date.getTime())) {
    throw new Error('유효하지 않은 날짜입니다')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns YYYY-MM-DD 형식의 문자열 (예: "2025-09-06")
 */
export function getTodayYYYYMMDD(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
