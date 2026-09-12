// FILE: apps/api-gateway/src/modules/auth/interfaces/core-menu-permission.interface.ts
/**
 * One menu entry from Core `GET /auth/menupermissions`.
 *
 * Core envelope shape:
 * ```json
 * {
 *   "status": true,
 *   "message": "Retrieved successfully",
 *   "data": {
 *     "records": [
 *       { "menu_key": "ghg-activity-inventories", "permissions": ["show-list-data", ...] }
 *     ],
 *     "meta": { "page": 1, "limit": -1, "total": 3, "pageTotal": 1 }
 *   }
 * }
 * ```
 */
export interface CoreMenuPermission {
  menu_key: string;
  permissions: string[];
}
