import { request } from './client'

export type ScheduleType = 'CONSULTATION' | 'VISIT' | 'ETC'
export type ScheduleGender = 'MALE' | 'FEMALE'

export interface ScheduleResponse {
  scheduleId: string
  scheduleType: ScheduleType
  title?: string
  customerName?: string
  gender?: ScheduleGender
  serviceName?: string
  startAt: string
  endAt: string
  memo?: string
}

export interface ScheduleListResponse {
  startDate: string
  endDate: string
  schedules: ScheduleResponse[]
}

export interface ScheduleDetailResponse extends ScheduleResponse {
  createdBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface ScheduleCreateRequest {
  scheduleType: ScheduleType
  customerName?: string
  gender?: ScheduleGender
  serviceName?: string
  startAt: string
  endAt: string
  memo?: string
}

export type ScheduleUpdateRequest = ScheduleCreateRequest

export function getSchedules(startDate: string, endDate: string): Promise<ScheduleListResponse> {
  return request<ScheduleListResponse>(`/api/schedules?startDate=${startDate}&endDate=${endDate}`)
}

export function createSchedule(req: ScheduleCreateRequest): Promise<ScheduleResponse> {
  return request<ScheduleResponse>('/api/schedules', { method: 'POST', body: req })
}

export function getScheduleDetail(scheduleId: string): Promise<ScheduleDetailResponse> {
  return request<ScheduleDetailResponse>(`/api/schedules/${scheduleId}`)
}

export function updateSchedule(scheduleId: string, req: ScheduleUpdateRequest): Promise<ScheduleResponse> {
  return request<ScheduleResponse>(`/api/schedules/${scheduleId}`, { method: 'PATCH', body: req })
}

export function deleteSchedule(scheduleId: string): Promise<void> {
  return request<void>(`/api/schedules/${scheduleId}`, { method: 'DELETE' })
}
