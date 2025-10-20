/**
 * FERPA RBAC Implementation
 *
 * Role-Based Access Control for educational records compliance
 */

import {
  UserRole,
  Permission,
  AccessControl,
  DataClassification
} from '../types';

// ============================================================================
// Role-Permission Mapping
// ============================================================================

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [Permission.READ],
  [UserRole.PARENT]: [Permission.READ, Permission.EXPORT],
  [UserRole.GUARDIAN]: [Permission.READ, Permission.EXPORT],
  [UserRole.TEACHER]: [Permission.READ, Permission.WRITE],
  [UserRole.COUNSELOR]: [Permission.READ, Permission.WRITE, Permission.SHARE],
  [UserRole.ADMINISTRATOR]: [Permission.READ, Permission.WRITE, Permission.DELETE, Permission.SHARE, Permission.EXPORT],
  [UserRole.SCHOOL_OFFICIAL]: [Permission.READ, Permission.WRITE, Permission.AUDIT]
};

// ============================================================================
// Data Classification Rules
// ============================================================================

const CLASSIFICATION_ACCESS: Record<DataClassification, UserRole[]> = {
  [DataClassification.PUBLIC]: Object.values(UserRole),
  [DataClassification.INTERNAL]: [
    UserRole.TEACHER,
    UserRole.COUNSELOR,
    UserRole.ADMINISTRATOR,
    UserRole.SCHOOL_OFFICIAL
  ],
  [DataClassification.CONFIDENTIAL]: [
    UserRole.COUNSELOR,
    UserRole.ADMINISTRATOR,
    UserRole.SCHOOL_OFFICIAL
  ],
  [DataClassification.RESTRICTED]: [
    UserRole.ADMINISTRATOR,
    UserRole.SCHOOL_OFFICIAL
  ]
};

// ============================================================================
// RBAC Manager
// ============================================================================

export class RBACManager {
  private accessControls: Map<string, AccessControl[]> = new Map();

  /**
   * Grant access to a user
   */
  grantAccess(accessControl: AccessControl): void {
    const userControls = this.accessControls.get(accessControl.userId) || [];
    userControls.push(accessControl);
    this.accessControls.set(accessControl.userId, userControls);
  }

  /**
   * Revoke access from a user
   */
  revokeAccess(userId: string, resourceId: string): void {
    const userControls = this.accessControls.get(userId) || [];
    const filtered = userControls.filter(ac => !ac.resources.includes(resourceId));
    this.accessControls.set(userId, filtered);
  }

  /**
   * Check if user has permission for a resource
   */
  hasPermission(
    userId: string,
    role: UserRole,
    permission: Permission,
    resourceId: string,
    dataClassification: DataClassification
  ): boolean {
    // Check if role has access to this data classification
    if (!CLASSIFICATION_ACCESS[dataClassification].includes(role)) {
      return false;
    }

    // Check if role has this permission
    if (!ROLE_PERMISSIONS[role].includes(permission)) {
      return false;
    }

    // Check specific access controls
    const userControls = this.accessControls.get(userId) || [];
    const hasAccess = userControls.some(ac => {
      const notExpired = !ac.expiresAt || ac.expiresAt > new Date();
      const hasResource = ac.resources.includes(resourceId) || ac.resources.includes('*');
      const hasPermission = ac.permissions.includes(permission);
      return notExpired && hasResource && hasPermission;
    });

    return hasAccess;
  }

  /**
   * Get all permissions for a user
   */
  getUserPermissions(userId: string, role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Get accessible resources for a user
   */
  getAccessibleResources(userId: string): string[] {
    const userControls = this.accessControls.get(userId) || [];
    const resources = new Set<string>();

    for (const control of userControls) {
      const notExpired = !control.expiresAt || control.expiresAt > new Date();
      if (notExpired) {
        control.resources.forEach(r => resources.add(r));
      }
    }

    return Array.from(resources);
  }

  /**
   * Check if user can access student data (FERPA specific)
   */
  canAccessStudentData(
    userId: string,
    role: UserRole,
    studentId: string
  ): boolean {
    // Students can only access their own data
    if (role === UserRole.STUDENT) {
      return userId === studentId;
    }

    // Parents/Guardians need explicit access
    if (role === UserRole.PARENT || role === UserRole.GUARDIAN) {
      const userControls = this.accessControls.get(userId) || [];
      return userControls.some(ac =>
        ac.resources.includes(studentId) && !ac.expiresAt || ac.expiresAt > new Date()
      );
    }

    // School officials need legitimate educational interest
    if (role === UserRole.TEACHER || role === UserRole.COUNSELOR ||
        role === UserRole.ADMINISTRATOR || role === UserRole.SCHOOL_OFFICIAL) {
      return this.hasLegitimateEducationalInterest(userId, studentId);
    }

    return false;
  }

  /**
   * Verify legitimate educational interest (FERPA requirement)
   */
  private hasLegitimateEducationalInterest(
    officialId: string,
    studentId: string
  ): boolean {
    // Check if official has active relationship with student
    const userControls = this.accessControls.get(officialId) || [];
    return userControls.some(ac => {
      const hasStudent = ac.resources.includes(studentId);
      const notExpired = !ac.expiresAt || ac.expiresAt > new Date();
      return hasStudent && notExpired;
    });
  }

  /**
   * Grant parent/guardian access to student data
   */
  grantParentalAccess(
    parentId: string,
    studentId: string,
    grantedBy: string,
    expiresAt?: Date
  ): AccessControl {
    const accessControl: AccessControl = {
      userId: parentId,
      role: UserRole.PARENT,
      permissions: [Permission.READ, Permission.EXPORT],
      resources: [studentId],
      grantedBy,
      grantedAt: new Date(),
      expiresAt
    };

    this.grantAccess(accessControl);
    return accessControl;
  }

  /**
   * Grant temporary access (e.g., for substitute teacher)
   */
  grantTemporaryAccess(
    userId: string,
    role: UserRole,
    resources: string[],
    permissions: Permission[],
    grantedBy: string,
    durationDays: number
  ): AccessControl {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const accessControl: AccessControl = {
      userId,
      role,
      permissions,
      resources,
      grantedBy,
      grantedAt: new Date(),
      expiresAt
    };

    this.grantAccess(accessControl);
    return accessControl;
  }

  /**
   * Cleanup expired access controls
   */
  cleanupExpiredAccess(): number {
    let removed = 0;
    const now = new Date();

    for (const [userId, controls] of this.accessControls.entries()) {
      const filtered = controls.filter(ac => !ac.expiresAt || ac.expiresAt > now);
      removed += controls.length - filtered.length;

      if (filtered.length === 0) {
        this.accessControls.delete(userId);
      } else {
        this.accessControls.set(userId, filtered);
      }
    }

    return removed;
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const rbacManager = new RBACManager();
