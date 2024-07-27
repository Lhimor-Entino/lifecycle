<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\ProgramProgrammer;
use App\Models\ProgramTester;
use App\Models\Project;
use App\Models\ProjectCoordinator;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory;
use Illuminate\Database\Seeder;

class ProjectProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create();
        $rand = $faker->numberBetween(4,8);
        for($i=0;$i<=25;$i++){
            $project = Project::create([
                'user_id'=>User::all()->random()->id,
                'name'=>'Project '.$faker->lastName(),
                'client_name'=>$faker->company()
            ]);

            ProjectCoordinator::create([
                'project_id'=>$project->id,
                'user_id'=>User::all()->random()->id
            ]);

            for($j=0;$j<=$rand;$j++){
                $program=Program::create([
                    'project_id'=>$project->id,
                    'name'=>'Program '.$faker->lastName(),
                    'department'=>$faker->company(),
                    'date_prepared'=>Carbon::parse($faker->dateTimeThisYear()),
                    'scope_of_testing'=>$faker->text(200),
                    'test_strategy'=>$faker->text(200),
                    'testing_schedule'=>Carbon::parse($faker->dateTimeThisYear()),
                    'resources_needed'=>$faker->text(200),
                    'system_deadline'=>Carbon::parse($faker->dateTimeThisYear())
                ]);
                ProgramProgrammer::create([
                    'program_id'=>$program->id,
                    'user_id'=>User::all()->random()->id
                ]);
                ProgramProgrammer::create([
                    'program_id'=>$program->id,
                    'user_id'=>User::all()->random()->id
                ]);
                ProgramTester::create([
                    'program_id'=>$program->id,
                    'user_id'=>User::all()->random()->id
                ]);
                ProgramTester::create([
                    'program_id'=>$program->id,
                    'user_id'=>User::all()->random()->id
                ]);
            }
        }
    }
}
