<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    private const USERS = [
        ['name' => 'Admin User',   'email' => 'admin@orbit.test',   'role' => 'Admin'],
        ['name' => 'Manager User', 'email' => 'manager@orbit.test', 'role' => 'Manager'],
        ['name' => 'Staff User',   'email' => 'staff@orbit.test',   'role' => 'Staff'],
    ];

    public function run(): void
    {
        foreach (self::USERS as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make('password'),
                ]
            );
            $user->syncRoles([$data['role']]);
        }

        $this->command->info('Users seeded (all passwords: password):');
        foreach (self::USERS as $u) {
            $this->command->line("  [{$u['role']}] {$u['email']}");
        }
    }
}
