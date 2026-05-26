<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    // All permissions grouped by resource
    private const PERMISSIONS = [
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
        'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
        'users.view', 'users.edit',
        'roles.manage',
    ];

    public function run(): void
    {
        // Create all permissions
        foreach (self::PERMISSIONS as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        // Admin — all permissions
        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->syncPermissions(self::PERMISSIONS);

        // Manager — view/create/edit on core resources + user viewing
        $manager = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'web']);
        $manager->syncPermissions([
            'products.view', 'products.create', 'products.edit',
            'customers.view', 'customers.create', 'customers.edit',
            'orders.view', 'orders.create', 'orders.edit',
            'users.view',
        ]);

        // Staff — view only
        $staff = Role::firstOrCreate(['name' => 'Staff', 'guard_name' => 'web']);
        $staff->syncPermissions([
            'products.view',
            'customers.view',
            'orders.view',
        ]);

        // Create a default admin user if none exists
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@orbit.test'],
            [
                'name'     => 'Admin User',
                'password' => Hash::make('password'),
            ]
        );
        $adminUser->syncRoles(['Admin']);

        $this->command->info('Roles and permissions seeded. Admin: admin@orbit.test / password');
    }
}
