import { request } from './client'

export type StoreType =
  | 'GYM'
  | 'PT_STUDIO'
  | 'PILATES'
  | 'GOLF_ACADEMY'
  | 'YOGA'
  | 'CROSSFIT'
  | 'SPINNING'
  | 'SWIMMING'
  | 'OTHER'

export interface StoreSetupRequest {
  name: string
  storeType: StoreType
  customStoreType?: string
  phone?: string
  businessNumber?: string
  address?: string
}

export interface StoreSetupResponse {
  storeId: string
  name: string
  storeType: StoreType
}

export function setupStore(req: StoreSetupRequest): Promise<StoreSetupResponse> {
  return request<StoreSetupResponse>('/api/store', { method: 'POST', body: req })
}

export interface ServiceResponse {
  id: string
  name: string
  description?: string
  price?: number
  active: boolean
}

export function createService(name: string): Promise<ServiceResponse> {
  return request<ServiceResponse>('/api/store/services', { method: 'POST', body: { name } })
}

export function deleteService(serviceId: string): Promise<void> {
  return request<void>(`/api/store/services/${serviceId}`, { method: 'DELETE' })
}

export interface InflowPathResponse {
  id: string
  name: string
  displayOrder?: number
  active: boolean
}

export function createInflowPath(name: string): Promise<InflowPathResponse> {
  return request<InflowPathResponse>('/api/store/inflow-paths', { method: 'POST', body: { name } })
}

export function deleteInflowPath(inflowPathId: string): Promise<void> {
  return request<void>(`/api/store/inflow-paths/${inflowPathId}`, { method: 'DELETE' })
}

export type EventType = 'DISCOUNT' | 'PROMOTION' | 'PACKAGE' | 'REFERRAL' | 'OTHER'
export type EventStatus = 'ACTIVE' | 'INACTIVE' | 'ENDED'

export interface EventResponse {
  id: string
  title: string
  eventType: EventType
  description?: string
  discountRate?: number
  serviceId?: string
  startDate: string
  endDate: string
  status: EventStatus
}

export interface EventCreateRequest {
  title: string
  eventType: EventType
  description?: string
  discountRate?: number
  serviceId?: string
  startDate: string
  endDate: string
}

export interface EventUpdateRequest extends EventCreateRequest {
  status: EventStatus
}

export function createEvent(req: EventCreateRequest): Promise<EventResponse> {
  return request<EventResponse>('/api/store/events', { method: 'POST', body: req })
}

export function updateEvent(eventId: string, req: EventUpdateRequest): Promise<EventResponse> {
  return request<EventResponse>(`/api/store/events/${eventId}`, { method: 'PUT', body: req })
}

export function deleteEvent(eventId: string): Promise<void> {
  return request<void>(`/api/store/events/${eventId}`, { method: 'DELETE' })
}
