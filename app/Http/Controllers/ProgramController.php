<?php

namespace App\Http\Controllers;

use App\Mail\FailedTest;
use App\Mail\NotifySetUpCommitee;
use App\Mail\SetUpSchedule;
use App\Mail\TRDNotification;
use App\Models\AttendeesModel;
use App\Models\Program;
use App\Models\ProgramProgrammer;
use App\Models\ProgramSetupSchedule;
use App\Models\ProgramTester;
use App\Models\Step;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

     public function faceSwap(){
      
$curl = curl_init();

        curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.magicapi.dev/api/v1/magicapi/faceswap/faceswap-v2",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"input\":{\"swap_image\":\"https://blog.api.market/wp-content/uploads/2024/06/Elon_Musk.png\",\"target_image\":\"https://blog.api.market/wp-content/uploads/2024/06/Shahrukh_khan.png\"}}",
        CURLOPT_HTTPHEADER => [
            "content-type: application/json",
            "x-magicapi-key: clxyhwifn0001la09v7l8iu6y"
        ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
        echo "cURL Error #:" . $err;
        } else {
        echo $response;
        }

     }
    public function store(Request $request)
    {

        $program = Program::create([
            'project_id' => $request->project_id,
            'name' => $request->name,
            'department' => $request->department,
            'date_prepared' => Carbon::parse($request->date_prepared),
            'scope_of_testing' => $request->scope_of_testing,
            'test_strategy' => $request->test_strategy,
            'testing_schedule' => Carbon::parse($request->testing_schedule),
            'resources_needed' => $request->resources_needed,
            'system_deadline' => Carbon::parse($request->system_deadline)
        ]);

        $programmers = $request->programmers;
        foreach ($programmers as $programmer) {
            $user = User::firstOrCreate(
                ['company_id' => $programmer['idno']],
                [
                    'first_name' => $programmer['first_name'],
                    'last_name' => $programmer['last_name'],
                    'password' => bcrypt('password'),
                    'position' => $programmer['job_job_title'],
                    'department' => $programmer['department'],
                    'email' => $programmer['work_email'],
                ]
            );
            ProgramProgrammer::create([
                'program_id' => $program->id,
                'user_id' => $user->id
            ]);
        }

        $testers = $request->testers;
        foreach ($testers as $tester) {
            $user = User::firstOrCreate(
                ['company_id' => $tester['idno']],
                [
                    'first_name' => $tester['first_name'],
                    'last_name' => $tester['last_name'],
                    'password' => bcrypt('password'),
                    'position' => $tester['job_job_title'],
                    'department' => $tester['department'],
                    'email' => $tester['work_email'],
                ]
            );
            ProgramTester::create([
                'program_id' => $program->id,
                'user_id' => $user->id
            ]);
        }

        return redirect()->back();
    }

    public function new(Request $request)
    {

    
        Program::create([
            'project_id' => $request->project_id,
            'name' => $request->name,
            'department' => $request->department,
            'step_id' => Step::where('step', 1)->first()->id
        ]);
    return redirect()->back();
        // $programmers = $request->programmers;
        // foreach ($programmers as $programmer) {
        //     $user = User::firstOrCreate(
        //         ['company_id' => $programmer['idno']],
        //         [
        //             'first_name' => $programmer['first_name'],
        //             'last_name' => $programmer['last_name'],
        //             'password' => bcrypt('password'),
        //             'position' => $programmer['job_job_title'],
        //             'department' => $programmer['department'],
        //             'email' => $programmer['work_email'],
        //         ]
        //     );
        //     ProgramProgrammer::create([
        //         'program_id' => $program->id,
        //         'user_id' => $user->id
        //     ]);
        // }

        // $testers = $request->testers;
        // foreach ($testers as $tester) {
        //     $user = User::firstOrCreate(
        //         ['company_id' => $tester['idno']],
        //         [
        //             'first_name' => $tester['first_name'],
        //             'last_name' => $tester['last_name'],
        //             'password' => bcrypt('password'),
        //             'position' => $tester['job_job_title'],
        //             'department' => $tester['department'],
        //             'email' => $tester['work_email'],
        //         ]
        //     );
        //     ProgramTester::create([
        //         'program_id' => $program->id,
        //         'user_id' => $user->id
        //     ]);
        // }

    
    }

    /**
     * Display the specified resource.
     *0
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $program = Program::with(['project', 'business_requirement_document','business_requirement_document_history', 'techinical_requirement_document', 'program_setup_schedule','change_requests','additional_attendees'])->where('id', $id)->firstOrFail();
        
        Inertia::share('selected_program', $program);
        Inertia::share('programs',$program);
        return Inertia::render('Program', [
            'program' => $program
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);
        $program->update([
            'name' => $request->name,
            'department' => $request->department,
            'date_prepared' => Carbon::parse($request->date_prepared),
            'scope_of_testing' => $request->scope_of_testing,
            'test_strategy' => $request->test_strategy,
            'testing_schedule' => Carbon::parse($request->testing_schedule),
            'resources_needed' => $request->resources_needed,
            'system_deadline' => Carbon::parse($request->system_deadline)
        ]);

        //delete all programmers and testers
        $old_programmers = ProgramProgrammer::where('program_id', $id)->get();
        $old_programmers->each(function ($programmer) {
            $programmer->delete();
        });
        $old_testers = ProgramTester::where('program_id', $id)->get();
        $old_testers->each(function ($tester) {
            $tester->delete();
        });
        $programmers = $request->programmers;
        foreach ($programmers as $programmer) {
            $user = User::firstOrCreate(
                ['company_id' => $programmer['idno']],
                [
                    'first_name' => $programmer['first_name'],
                    'last_name' => $programmer['last_name'],
                    'password' => bcrypt('password'),
                    'position' => $programmer['job_job_title'],
                    'department' => $programmer['department'],
                    'email' => $programmer['work_email'],

                ]
            );
            ProgramProgrammer::create([
                'program_id' => $program->id,
                'user_id' => $user->id
            ]);
        }

        $testers = $request->testers;
        foreach ($testers as $tester) {
            $user = User::firstOrCreate(
                ['company_id' => $tester['idno']],
                [
                    'first_name' => $tester['first_name'],
                    'last_name' => $tester['last_name'],
                    'password' => bcrypt('password'),
                    'position' => $tester['job_job_title'],
                    'department' => $tester['department'],
                    'email' => $tester['work_email'],
                ]
            );
            ProgramTester::create([
                'program_id' => $program->id,
                'user_id' => $user->id
            ]);
        }

        if ($program->step_id == Step::where('step', 7)->first()->id) {
            $program->update([
                'step_id' => Step::where('step', 8)->first()->id
            ]);
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $program = Program::findOrFail($id);
        $program->delete();
        return redirect()->back();
   
    }

    public function trd_notif(Request $request)
    {
        $program = Program::findOrFail($request->program_id);
        // $testers = $program->program_testers;
        $testers = $request->emails;
        $setup_committee = json_decode($request->setup_committee,true);
        $sw_head = json_decode($request->software_manager,true);

        $setup_committee_emails = array_map(function ($user) {
            return $user['email'];
        }, $setup_committee);

        $sw_head_email[0] = $sw_head['email']; 

        //create an array of emails from $users->email field
        $emails = array_map(function ($user) {
            return $user['email'];
        }, $testers);

        

        $coordinators = $program->project->project_coordinators;
        $programmers = $program->program_programmers;

        $coordinator_emails = array_map(function ($user) {
            return $user['email'];
        }, $coordinators->toArray());

        $programmer_emails = array_map(function ($user) {
            return $user['email'];
        }, $programmers->toArray());

        $to_emails = array_merge($emails,$setup_committee_emails,$sw_head_email);
      
        $cc_emails = array_merge($coordinator_emails, $programmer_emails);

        Mail::to($to_emails)
            ->cc($cc_emails)
            ->send(
                new TRDNotification(
                    env('MAIL_FROM_NAME', 'DDC Software'),
                    env('MAIL_FROM_ADDRESS', 'donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        $next_step = Step::where('step', 3)->first();
        $program->update([
            'step_id' => $next_step->id
        ]);
        return redirect()->back();
    }

    public function notify_setup_comitee(Request $request)
    {
        $program = Program::findOrFail($request->program_id);
        $testers = json_decode($request->program_testers,true);
        $programmers = $program->program_programmers;
        $coordinators = $program->project->project_coordinators;

        $setup_committee = json_decode($request->setup_committee,true);
        $sw_head = json_decode($request->software_manager,true);

        $setup_committee_emails = array_map(function ($user) {
            return $user['email'];
        }, $setup_committee);

        $sw_head_email[0] = $sw_head['email']; 
 
        $emails = array_map(function ($user) {
            return $user['email'];
        }, $coordinators->toArray());

        $tester_emails = array_map(function ($user) {
            return $user['email'];
        }, $testers);

        $programmer_emails = array_map(function ($user) {
            return $user['email'];
        }, $programmers->toArray());

        $to_emails = array_merge($emails,$setup_committee_emails,$sw_head_email);
        $cc_emails = array_merge($tester_emails, $programmer_emails);

        Mail::to($to_emails)
            ->cc($cc_emails)
            ->send(
                new NotifySetUpCommitee(
                    env('MAIL_FROM_NAME', 'DDC Software'),
                    env('MAIL_FROM_ADDRESS', 'donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        $next_step = Step::where('step', 5)->first();
        $program->update([
            'step_id' => $next_step->id
        ]);
        return redirect()->back();
    }


    // public function check_attendees_exist(Request $request){
      
    //     $res = AttendeesModel::where("company_id",$request->idno)->get()->pluck("email")->toArray();

    //  return redirect()->back();
    // }
    public function setup_sched(Request $request)
    {   
        $program = Program::findOrFail($request->program_id);
        $additional_attendees = json_decode($request->additional_attendees,true);

        foreach ($additional_attendees as $val){
                AttendeesModel::updateOrCreate(
                    [
                        'company_id'=>$val['idno'],
                        "program_id" => $request->program_id,
                    ],
                    [
                        'first_name'=>$val['first_name'],
                        'last_name'=>$val['last_name'],
                        'email'=>$val['work_email'],
                        'position'=>$val['job_job_title'],
                        'department'=>$val['jobrole'],
                    ]
                );
        }
        ProgramSetupSchedule::updateOrCreate(
        [

            'program_id' => $request->program_id
        ],
         [
            'date' => Carbon::parse($request->date),
        ]
    );



        if ($program->step_id == Step::where('step', 5)->first()->id) {
            $program->update([
                'step_id' => Step::where('step', 6)->first()->id
            ]);
        }

     
        // $programmers = json_decode($request->programmers, true);
    
        // foreach ($programmers as $programmer) {
        //     $user = User::firstOrCreate(
        //         ['company_id' => $programmer['idno']],
        //         [
        //             'first_name' => $programmer['first_name'],
        //             'last_name' => $programmer['last_name'],
        //             'password' => bcrypt('password'),
        //             'position' => $programmer['job_job_title'],
        //             'department' => $programmer['department'],
        //             'email' => strlen($programmer['work_email']) < 3 ? null : $programmer['work_email'],
        //         ]
        //     );
        //     ProgramProgrammer::create([
        //         'program_id' => $program->id,
        //         'user_id' => $user->id
        //     ]);
        // }

        // $testers = json_decode($request->testers, true);
        // foreach ($testers as $tester) {
        //     $user = User::firstOrCreate(
        //         ['company_id' => $tester['idno']],
        //         [
        //             'first_name' => $tester['first_name'],
        //             'last_name' => $tester['last_name'],
        //             'password' => bcrypt('password'),
        //             'position' => $tester['job_job_title'],
        //             'department' => $tester['department'],
        //             'email' => strlen($tester['work_email']) < 3 ? null : $tester['work_email'],
        //         ]
        //     );
        //     ProgramTester::create([
        //         'program_id' => $program->id,
        //         'user_id' => $user->id
        //     ]);
        // }


        return redirect()->back();
    }

    public function setup_sched_reminder(Request $request)
    {
        $program = Program::findOrFail($request->program_id);
        $testers =  json_decode($request->program_testers,true);
        $programmers = $program->program_programmers;
        $coordinators = $program->project->project_coordinators;

        $setup_committee = json_decode($request->setup_committee,true);
        $additional_attendees = json_decode($request->additional_attendees,true);
        $sw_head = json_decode($request->software_manager,true);

        $additional_attendees_emails = array_map(function ($user) {
            return $user['email'];
        }, $additional_attendees);

        $setup_committee_emails = array_map(function ($user) {
            return $user['email'];
        }, $setup_committee);

        $sw_head_email[0] = $sw_head['email']; 

        $emails = array_map(function ($user) {
            return $user['email'];
        }, $coordinators->toArray());

        $tester_emails = array_map(function ($user) {
            return $user['email'];
        }, $testers);

        $programmer_emails = array_map(function ($user) {
            return $user['email'];
        }, $programmers->toArray());

        $to_emails = array_merge($tester_emails,$setup_committee_emails,$sw_head_email,$additional_attendees_emails);
        $cc_emails = array_merge($emails);


        Mail::to($to_emails)
            ->cc($cc_emails)
            ->send(
                new SetUpSchedule(
                    env('MAIL_FROM_NAME', 'DDC Software'),
                    env('MAIL_FROM_ADDRESS', 'donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        if ($program->step_id == Step::where('step', 8)->first()->id) {
            $program->update([
                'step_id' => Step::where('step', 9)->first()->id
            ]);
        }
        return redirect()->back();
    }

    public function test_plan_email_notif(Request $request)
    {
        $program = Program::findOrFail($request->program_id);
        $testers =  json_decode($request->program_testers,true);
        $programmers = $program->program_programmers;
        $coordinators = $program->project->project_coordinators;

        $setup_committee = json_decode($request->setup_committee,true);
        $sw_head = json_decode($request->software_manager,true);

        $setup_committee_emails = array_map(function ($user) {
            return $user['email'];
        }, $setup_committee);

        $sw_head_email[0] = $sw_head['email']; 

        $emails = array_map(function ($user) {
            return $user['email'];
        }, $coordinators->toArray());

        $tester_emails = array_map(function ($user) {
            return $user['email'];
        }, $testers);

        $programmer_emails = array_map(function ($user) {
            return $user['email'];
        }, $programmers->toArray());

        $to_emails = array_merge($emails,$setup_committee_emails,$sw_head_email);
        $cc_emails = array_merge($tester_emails, $programmer_emails);


        Mail::to($to_emails)
            ->cc($cc_emails)
            ->send(
                new SetUpSchedule(
                    env('MAIL_FROM_NAME', 'DDC Software'),
                    env('MAIL_FROM_ADDRESS', 'donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        if ($program->step_id == Step::where('step', 8)->first()->id) {
            $program->update([
                'step_id' => Step::where('step', 9)->first()->id
            ]);
        }
        return redirect()->back();
    }

    public function next_step(Request $request, $id)
    {
        $program = Program::findOrFail($id);
        $program->update([
            'step_id' => $request->step_id
        ]);
        return redirect()->back();
    }

    public function failed_test(Request $request)
    {
        $program = Program::findOrFail($request->program_id);
        $testers = $program->program_testers;
        $programmers = $program->program_programmers;

        $sw_head = json_decode($request->software_manager,true);

        $sw_head_email[0] = $sw_head['email']; 

        $tester_emails = array_map(function ($user) {
            return $user['email'];
        }, $testers->toArray());

        $programmer_emails = array_map(function ($user) {
            return $user['email'];
        }, $programmers->toArray());


        $emails = array_merge($tester_emails, $programmer_emails,$sw_head_email);

        Mail::to($emails)
            ->send(
                new FailedTest(
                    env('MAIL_FROM_NAME', 'DDC Software'),
                    env('MAIL_FROM_ADDRESS', 'donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        if ($program->step_id == Step::where('step', 10)->first()->id) {
            $program->update([
                'step_id' => Step::where('step', 11)->first()->id
            ]);
        }
        return redirect()->back();
    }

    public function completed_test(Request $request)
    {
        $program = Program::findOrFail($request->program_id);
        $testers = $program->program_testers;
        $programmers = $program->program_programmers;
        $setup_committee = json_decode($request->setup_committee,true);
        $sw_head = json_decode($request->software_manager,true);
        $coordinators = $program->project->project_coordinators;

        $coordinator_emails = array_map(function ($user) {
            return $user['email'];
        }, $coordinators->toArray());
        $setup_committee_emails = array_map(function ($user) {
            return $user['email'];
        }, $setup_committee);

        $sw_head_email[0] = $sw_head['email']; 
        $tester_emails = array_map(function ($user) {
            return $user['email'];
        }, $testers->toArray());

        $programmer_emails = array_map(function ($user) {
            return $user['email'];
        }, $programmers->toArray());

        $to_emails = array_merge($setup_committee_emails,$sw_head_email,$coordinator_emails);
        $cc_emails = array_merge($tester_emails, $programmer_emails);

        Mail::to($to_emails)
            ->cc($cc_emails)
            ->send(
                new FailedTest(
                    env('MAIL_FROM_NAME', 'DDC Software'),
                    env('MAIL_FROM_ADDRESS', 'donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        $program->update([
            'step_id' => Step::where('step', 12)->first()->id
        ]);
        return redirect()->back();
    }



    public function test_cases_passed(Request $request)
    {
        $program = Program::findOrFail($request->program_id);


        Mail::to('sheryl@datacapture.com.ph')
            ->send(
                new FailedTest(
                    env('MAIL_FROM_NAME', 'DDC Software'),
                    env('MAIL_FROM_ADDRESS', 'donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        $program->update([
            'step_id' => Step::where('step', 13)->first()->id
        ]);
        return redirect()->back();
    }

    public function change_request(Request $request)
    {
        $program = Program::findOrFail($request->program_id);
        $testers = $program->program_testers;
        $programmers = $program->program_programmers;
        $coordinators = $program->project->project_coordinators;
        $sw_head_email = ["sheryl@datacapture.com.ph"];
        $to_emails = array_map(function ($user) {
            return $user['email'];
        }, $coordinators->toArray());
        $tester_emails = array_map(function ($user) {
            return $user['email'];
        }, $testers->toArray());

        $programmer_emails = array_map(function ($user) {
            return $user['email'];
        }, $programmers->toArray());
    
        $cc_emails =  array_merge($tester_emails, $programmer_emails,$sw_head_email);
        Mail::to($to_emails)
            ->cc($cc_emails)
            ->send(
                new FailedTest(
                    env('MAIL_FROM_NAME', 'DDC Software'),
                    env('MAIL_FROM_ADDRESS', 'donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        // $program->update([
        //     'step_id' => Step::where('step', 17)->first()->id
        // ]);
        return redirect()->back();
    }

    public function acknowledge($id){
        $program = Program::findOrFail($id);

        $program->update([
            'checked_by_sw_mngr' => 1
        ]);

              // Construct HTML response directly
        $html = "<html><head><title>Acknowledgement Page</title></head><body>";
        
        $html .= "<h1>Program Acknowledged Successfully</h1>";
        $html .= "<p>Program Name: " . $program['name'] . "</p>";
        $html .= "<p>Checked By Software Manager: Yes</p>";
        $html .= "</body></html>";
      
        return response($html);
    }
}
