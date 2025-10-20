/**
 * Access Control and Permission Management System
 * Role-Based Access Control (RBAC) with fine-grained permissions
 * Implements principle of least privilege for FERPA/COPPA compliance
 */

import { createClient } from '@supabase/supabase-js';

// System roles
export enum Role {
  SUPER_ADMIN = 'super_admin',
  DISTRICT_ADMIN = 'district_admin',
  SCHOOL_ADMIN = 'school_admin',
  TEACHER = 'teacher',
  PARENT = 'parent',
  STUDENT = 'student',
  SUPPORT_STAFF = 'support_staff',
  CONTENT_MANAGER = 'content_manager',
  AUDITOR = 'auditor',
  RESEARCHER = 'researcher'
}

// Permission categories
export enum PermissionCategory {
  USER_MANAGEMENT = 'user_management',
  STUDENT_DATA = 'student_data',
  CONTENT_MANAGEMENT = 'content_management',
  ASSESSMENT = 'assessment',
  REPORTING = 'reporting',
  SYSTEM_CONFIG = 'system_config',
  AUDIT = 'audit'
}

// Specific permissions
export enum Permission {
  // User Management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  ASSIGN_ROLES = 'assign_roles',

  // Student Data
  READ_STUDENT_RECORD = 'read_student_record',
  UPDATE_STUDENT_RECORD = 'update_student_record',
  DELETE_STUDENT_RECORD = 'delete_student_record',
  EXPORT_STUDENT_DATA = 'export_student_data',
  VIEW_ALL_STUDENTS = 'view_all_students',

  // Assessment
  CREATE_ASSESSMENT = 'create_assessment',
  VIEW_ASSESSMENT_RESULTS = 'view_assessment_results',
  EXPORT_ASSESSMENT_DATA = 'export_assessment_data',

  // Content Management
  CREATE_CONTENT = 'create_content',
  EDIT_CONTENT = 'edit_content',
  PUBLISH_CONTENT = 'publish_content',
  DELETE_CONTENT = 'delete_content',

  // Reporting
  VIEW_REPORTS = 'view_reports',
  CREATE_REPORTS = 'create_reports',
  EXPORT_REPORTS = 'export_reports',

  // System Configuration
  MODIFY_SYSTEM_CONFIG = 'modify_system_config',
  VIEW_SYSTEM_CONFIG = 'view_system_config',

  // Audit
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  EXPORT_AUDIT_LOGS = 'export_audit_logs'
}

// Access context
export interface AccessContext {
  userId: string;
  userRole: Role;
  schoolId?: string;
  districtId?: string;
  sessionId: string;
  ipAddress?: string;
  timestamp: Date;
}

// Permission check result
export interface PermissionCheckResult {
  granted: boolean;
  reason?: string;
  requiredPermissions: Permission[];
  missingPermissions?: Permission[];
  context: AccessContext;
}

// Role definition
export interface RoleDefinition {
  role: Role;
  description: string;
  permissions: Permission[];
  inheritsFrom?: Role[];
  restrictions?: {
    maxStudents?: number;
    schoolScope?: boolean;
    districtScope?: boolean;
    dataRetentionDays?: number;
  };
}

/**
 * Access Control Service
 */
export class AccessControlService {
  private supabase: any;
  private rolePermissions: Map<Role, Set<Permission>> = new Map();

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    this.supabase = createClient(
      supabaseUrl || Deno.env.get('SUPABASE_URL')!,
      supabaseKey || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    this.initializeRolePermissions();
  }

  /**
   * Initialize role-permission mappings
   */
  private initializeRolePermissions(): void {
    // Super Admin - Full access
    this.rolePermissions.set(Role.SUPER_ADMIN, new Set(Object.values(Permission)));

    // District Admin - District-wide access
    this.rolePermissions.set(Role.DISTRICT_ADMIN, new Set([
      Permission.CREATE_USER,
      Permission.READ_USER,
      Permission.UPDATE_USER,
      Permission.VIEW_ALL_STUDENTS,
      Permission.READ_STUDENT_RECORD,
      Permission.VIEW_ASSESSMENT_RESULTS,
      Permission.EXPORT_ASSESSMENT_DATA,
      Permission.VIEW_REPORTS,
      Permission.CREATE_REPORTS,
      Permission.EXPORT_REPORTS,
      Permission.VIEW_SYSTEM_CONFIG,
      Permission.VIEW_AUDIT_LOGS
    ]));

    // School Admin - School-wide access
    this.rolePermissions.set(Role.SCHOOL_ADMIN, new Set([
      Permission.CREATE_USER,
      Permission.READ_USER,
      Permission.UPDATE_USER,
      Permission.VIEW_ALL_STUDENTS,
      Permission.READ_STUDENT_RECORD,
      Permission.VIEW_ASSESSMENT_RESULTS,
      Permission.VIEW_REPORTS,
      Permission.CREATE_REPORTS,
      Permission.VIEW_SYSTEM_CONFIG
    ]));

    // Teacher - Assigned students only
    this.rolePermissions.set(Role.TEACHER, new Set([
      Permission.READ_USER,
      Permission.READ_STUDENT_RECORD,
      Permission.UPDATE_STUDENT_RECORD,
      Permission.CREATE_ASSESSMENT,
      Permission.VIEW_ASSESSMENT_RESULTS,
      Permission.VIEW_REPORTS,
      Permission.CREATE_CONTENT,
      Permission.EDIT_CONTENT
    ]));

    // Parent - Own children only
    this.rolePermissions.set(Role.PARENT, new Set([
      Permission.READ_USER,
      Permission.READ_STUDENT_RECORD,
      Permission.VIEW_ASSESSMENT_RESULTS,
      Permission.VIEW_REPORTS
    ]));

    // Student - Own data only
    this.rolePermissions.set(Role.STUDENT, new Set([
      Permission.READ_USER,
      Permission.VIEW_ASSESSMENT_RESULTS
    ]));

    // Content Manager
    this.rolePermissions.set(Role.CONTENT_MANAGER, new Set([
      Permission.CREATE_CONTENT,
      Permission.EDIT_CONTENT,
      Permission.PUBLISH_CONTENT,
      Permission.DELETE_CONTENT
    ]));

    // Auditor - Read-only access to audit data
    this.rolePermissions.set(Role.AUDITOR, new Set([
      Permission.VIEW_AUDIT_LOGS,
      Permission.EXPORT_AUDIT_LOGS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_REPORTS
    ]));

    // Researcher - Anonymized data only
    this.rolePermissions.set(Role.RESEARCHER, new Set([
      Permission.VIEW_REPORTS,
      Permission.EXPORT_REPORTS
    ]));
  }

  /**
   * Check if user has permission
   */
  async hasPermission(
    userId: string,
    permission: Permission,
    resourceId?: string
  ): Promise<PermissionCheckResult> {
    const context = await this.getAccessContext(userId);

    // Get user's permissions
    const userPermissions = this.rolePermissions.get(context.userRole) || new Set();

    if (!userPermissions.has(permission)) {
      return {
        granted: false,
        reason: `Role ${context.userRole} does not have permission ${permission}`,
        requiredPermissions: [permission],
        missingPermissions: [permission],
        context
      };
    }

    // Check resource-specific access if resourceId provided
    if (resourceId) {
      const resourceAccess = await this.checkResourceAccess(userId, context.userRole, resourceId);
      if (!resourceAccess.allowed) {
        return {
          granted: false,
          reason: resourceAccess.reason,
          requiredPermissions: [permission],
          context
        };
      }
    }

    return {
      granted: true,
      requiredPermissions: [permission],
      context
    };
  }

  /**
   * Check if user has all permissions
   */
  async hasAllPermissions(
    userId: string,
    permissions: Permission[],
    resourceId?: string
  ): Promise<PermissionCheckResult> {
    const context = await this.getAccessContext(userId);
    const userPermissions = this.rolePermissions.get(context.userRole) || new Set();

    const missingPermissions = permissions.filter(p => !userPermissions.has(p));

    if (missingPermissions.length > 0) {
      return {
        granted: false,
        reason: `Missing permissions: ${missingPermissions.join(', ')}`,
        requiredPermissions: permissions,
        missingPermissions,
        context
      };
    }

    if (resourceId) {
      const resourceAccess = await this.checkResourceAccess(userId, context.userRole, resourceId);
      if (!resourceAccess.allowed) {
        return {
          granted: false,
          reason: resourceAccess.reason,
          requiredPermissions: permissions,
          context
        };
      }
    }

    return {
      granted: true,
      requiredPermissions: permissions,
      context
    };
  }

  /**
   * Check if user has any of the permissions
   */
  async hasAnyPermission(
    userId: string,
    permissions: Permission[]
  ): Promise<PermissionCheckResult> {
    const context = await this.getAccessContext(userId);
    const userPermissions = this.rolePermissions.get(context.userRole) || new Set();

    const hasAny = permissions.some(p => userPermissions.has(p));

    if (!hasAny) {
      return {
        granted: false,
        reason: `User does not have any of the required permissions`,
        requiredPermissions: permissions,
        missingPermissions: permissions,
        context
      };
    }

    return {
      granted: true,
      requiredPermissions: permissions,
      context
    };
  }

  /**
   * Get access context for user
   */
  private async getAccessContext(userId: string): Promise<AccessContext> {
    const { data: user } = await this.supabase
      .from('users')
      .select('role, school_id, district_id')
      .eq('id', userId)
      .single();

    return {
      userId,
      userRole: user?.role || Role.STUDENT,
      schoolId: user?.school_id,
      districtId: user?.district_id,
      sessionId: crypto.randomUUID(),
      timestamp: new Date()
    };
  }

  /**
   * Check resource-specific access
   */
  private async checkResourceAccess(
    userId: string,
    userRole: Role,
    resourceId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // For teachers, check if student is assigned
    if (userRole === Role.TEACHER) {
      const { data: assignment } = await this.supabase
        .from('teacher_student_assignments')
        .select('*')
        .eq('teacher_id', userId)
        .eq('student_id', resourceId)
        .gte('end_date', new Date().toISOString())
        .single();

      if (!assignment) {
        return { allowed: false, reason: 'Student not assigned to teacher' };
      }
    }

    // For parents, check if child relationship exists
    if (userRole === Role.PARENT) {
      const { data: relationship } = await this.supabase
        .from('parent_student_relationships')
        .select('*')
        .eq('parent_id', userId)
        .eq('student_id', resourceId)
        .eq('verified', true)
        .single();

      if (!relationship) {
        return { allowed: false, reason: 'Not a verified parent of this student' };
      }
    }

    // For students, check if accessing own data
    if (userRole === Role.STUDENT && userId !== resourceId) {
      return { allowed: false, reason: 'Students can only access their own data' };
    }

    return { allowed: true };
  }

  /**
   * Assign role to user
   */
  async assignRole(
    userId: string,
    role: Role,
    assignedBy: string
  ): Promise<void> {
    // Check if assigner has permission
    const canAssignRoles = await this.hasPermission(assignedBy, Permission.ASSIGN_ROLES);

    if (!canAssignRoles.granted) {
      throw new Error('User does not have permission to assign roles');
    }

    // Update user role
    await this.supabase
      .from('users')
      .update({ role, role_assigned_by: assignedBy, role_assigned_at: new Date().toISOString() })
      .eq('id', userId);

    // Log role assignment
    await this.supabase.from('role_assignments').insert({
      user_id: userId,
      role,
      assigned_by: assignedBy,
      assigned_at: new Date().toISOString()
    });
  }

  /**
   * Create custom permission for user
   */
  async grantCustomPermission(
    userId: string,
    permission: Permission,
    grantedBy: string,
    expiresAt?: Date
  ): Promise<void> {
    await this.supabase.from('custom_permissions').insert({
      user_id: userId,
      permission,
      granted_by: grantedBy,
      granted_at: new Date().toISOString(),
      expires_at: expiresAt?.toISOString()
    });
  }

  /**
   * Revoke custom permission
   */
  async revokeCustomPermission(
    userId: string,
    permission: Permission,
    revokedBy: string
  ): Promise<void> {
    await this.supabase
      .from('custom_permissions')
      .update({
        revoked: true,
        revoked_by: revokedBy,
        revoked_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('permission', permission);
  }

  /**
   * Get user's effective permissions (role + custom)
   */
  async getUserPermissions(userId: string): Promise<{
    rolePermissions: Permission[];
    customPermissions: Permission[];
    allPermissions: Permission[];
  }> {
    const context = await this.getAccessContext(userId);
    const rolePerms = Array.from(this.rolePermissions.get(context.userRole) || []);

    // Get custom permissions
    const { data: customPerms } = await this.supabase
      .from('custom_permissions')
      .select('permission')
      .eq('user_id', userId)
      .eq('revoked', false)
      .or('expires_at.is.null,expires_at.gte.' + new Date().toISOString());

    const customPermissions = customPerms?.map(p => p.permission) || [];

    return {
      rolePermissions: rolePerms,
      customPermissions,
      allPermissions: [...new Set([...rolePerms, ...customPermissions])]
    };
  }

  /**
   * Check student data access with FERPA compliance
   */
  async checkStudentDataAccess(
    userId: string,
    studentId: string,
    dataType: 'basic' | 'grades' | 'health' | 'discipline'
  ): Promise<{ allowed: boolean; reason?: string; requiresConsent: boolean }> {
    const context = await this.getAccessContext(userId);

    // Parents always have access to their own child's data
    if (context.userRole === Role.PARENT) {
      const { data: relationship } = await this.supabase
        .from('parent_student_relationships')
        .select('*')
        .eq('parent_id', userId)
        .eq('student_id', studentId)
        .eq('verified', true)
        .single();

      if (relationship) {
        return { allowed: true, requiresConsent: false };
      }
      return { allowed: false, reason: 'Not a verified parent', requiresConsent: false };
    }

    // Teachers can access assigned students (basic and grades)
    if (context.userRole === Role.TEACHER) {
      const { data: assignment } = await this.supabase
        .from('teacher_student_assignments')
        .select('*')
        .eq('teacher_id', userId)
        .eq('student_id', studentId)
        .single();

      if (assignment) {
        // Health and discipline data require special permissions
        if (dataType === 'health' || dataType === 'discipline') {
          return { allowed: false, reason: 'Requires administrator access', requiresConsent: false };
        }
        return { allowed: true, requiresConsent: false };
      }
      return { allowed: false, reason: 'Student not assigned', requiresConsent: false };
    }

    // Administrators have broader access
    if ([Role.SCHOOL_ADMIN, Role.DISTRICT_ADMIN, Role.SUPER_ADMIN].includes(context.userRole)) {
      return { allowed: true, requiresConsent: false };
    }

    // Researchers require consent and anonymization
    if (context.userRole === Role.RESEARCHER) {
      const { data: consent } = await this.supabase
        .from('research_consents')
        .select('*')
        .eq('student_id', studentId)
        .eq('granted', true)
        .single();

      if (consent) {
        return { allowed: true, requiresConsent: true };
      }
      return { allowed: false, reason: 'Research consent not obtained', requiresConsent: true };
    }

    return { allowed: false, reason: 'Insufficient permissions', requiresConsent: false };
  }

  /**
   * Create data access request (for non-routine access)
   */
  async createAccessRequest(
    requesterId: string,
    studentId: string,
    purpose: string,
    dataRequested: string[]
  ): Promise<{ requestId: string; status: 'pending' | 'approved' | 'denied' }> {
    const requestId = crypto.randomUUID();

    await this.supabase.from('data_access_requests').insert({
      id: requestId,
      requester_id: requesterId,
      student_id: studentId,
      purpose,
      data_requested: dataRequested,
      status: 'pending',
      requested_at: new Date().toISOString()
    });

    return { requestId, status: 'pending' };
  }

  /**
   * Approve access request
   */
  async approveAccessRequest(
    requestId: string,
    approverId: string
  ): Promise<void> {
    // Check if approver has permission
    const canApprove = await this.hasPermission(approverId, Permission.UPDATE_STUDENT_RECORD);

    if (!canApprove.granted) {
      throw new Error('User does not have permission to approve access requests');
    }

    await this.supabase
      .from('data_access_requests')
      .update({
        status: 'approved',
        approved_by: approverId,
        approved_at: new Date().toISOString()
      })
      .eq('id', requestId);
  }

  /**
   * Generate access control report
   */
  async generateAccessReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    period: { start: Date; end: Date };
    summary: {
      totalAccessAttempts: number;
      allowedAccess: number;
      deniedAccess: number;
      pendingRequests: number;
    };
    byRole: Record<Role, number>;
    byPermission: Record<Permission, number>;
    topUsers: Array<{ userId: string; accessCount: number }>;
    violations: Array<{ userId: string; attempts: number }>;
  }> {
    // This would query actual access logs
    // Placeholder implementation
    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalAccessAttempts: 0,
        allowedAccess: 0,
        deniedAccess: 0,
        pendingRequests: 0
      },
      byRole: {} as any,
      byPermission: {} as any,
      topUsers: [],
      violations: []
    };
  }
}

/**
 * Permission decorator for edge functions
 */
export function requiresPermission(...permissions: Permission[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const userId = args[0]?.userId; // Assumes first arg contains userId

      if (!userId) {
        throw new Error('User ID not provided');
      }

      const accessControl = new AccessControlService();
      const result = await accessControl.hasAllPermissions(userId, permissions);

      if (!result.granted) {
        throw new Error(`Access denied: ${result.reason}`);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
