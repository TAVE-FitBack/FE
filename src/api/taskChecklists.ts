import { request } from './client'

export type TaskType = 'CONSULTATION'

export interface TaskChecklistResponse {
  taskId: string
  scheduleId: string
  title: string
  taskType: TaskType
  dueDate: string
  doneAt: string | null
  isDone: boolean
}

export interface TaskChecklistListResponse {
  date: string
  items: TaskChecklistResponse[]
}

export function getTaskChecklists(date: string): Promise<TaskChecklistListResponse> {
  return request<TaskChecklistListResponse>(`/api/task-checklists?date=${date}`)
}

export function updateTaskChecklistDone(taskId: string, isDone: boolean): Promise<TaskChecklistResponse> {
  return request<TaskChecklistResponse>(`/api/task-checklists/${taskId}`, { method: 'PATCH', body: { isDone } })
}
