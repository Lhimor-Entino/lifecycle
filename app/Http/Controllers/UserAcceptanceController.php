<?php

namespace App\Http\Controllers;

use App\Mail\FailedTest;
use App\Models\Program;
use App\Models\UserAcceptance;
use App\Models\UserAcceptanceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class UserAcceptanceController extends Controller
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
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        DB::transaction(function () use($request) {
            $ua=UserAcceptance::create([
                'program_id'=>$request->program_id,
                'user_id'=>Auth::id(),            
                'responsible'=>$request->responsible,
                'remarks'=>$request->remarks
            ]);
    
            $items = $request->items;
            foreach($items as $item){
                UserAcceptanceItem::create([
                    'user_acceptance_id'=>$ua->id,
                    'description'=>$item['description'],
                    'status'=>$item['status'],                    
                    'is_additional'=>$item['is_additional']
                ]);
            }
        });
        

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        DB::transaction(function () use($request,$id) {
            $ua = UserAcceptance::findOrFail($id);
            //delete all ua items
            $old_items = UserAcceptanceItem::where('user_acceptance_id',$ua->id)->get();
            $old_items->each(function($item){
                $item->delete();
            });
            $ua->update([
                'responsible'=>$request->responsible,                
                'remarks'=>$request->remarks,
            ]);
            $items = $request->items;
            foreach($items as $item){
                UserAcceptanceItem::create([
                    'user_acceptance_id'=>$ua->id,
                    'description'=>$item['description'],
                    'status'=>$item['status'],
                    'is_additional'=>$item['is_additional']
                ]);
            }
        });
        
        
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
        $ua = UserAcceptance::findOrFail($id);
        $ua->delete();
        return redirect()->back();
    }

    public function failed_test(Request $request){
        $program = Program::findOrFail($request->program_id);
        $project = $program->project;
        $project_coordinators = $project->project_coordinators;
        $testers = $program->program_testers;
        $programmers = $program->program_programmers;
        $setup_committee = json_decode($request->setup_committee,true);
        $sw_head = json_decode($request->software_manager,true);
        $cc_email = json_decode($request->cc_email,true);

   
        $setup_committee_emails = array_map(function ($user) {
            return $user['email'];
        }, $setup_committee);

        $sw_head_email[0] = $sw_head['email']; 

        $tester_emails = array_map(function($user) {
            return $user['email'];
        }, $testers->toArray());

        $programmer_emails = array_map(function($user) {
            return $user['email'];
        }, $programmers->toArray());

        $project_coordinator_emails = array_map(function($user) {
            return $user['email'];
        }, $project_coordinators->toArray());

        $emails = array_merge($tester_emails,$project_coordinator_emails,$setup_committee_emails,$sw_head_email);

        Mail::to($emails)
                // ->cc($cc_email)
                ->send(new FailedTest(
                    env('MAIL_FROM_NAME','DDC Software'),
                    env('MAIL_FROM_ADDRESS','donotreply@ddc-software.com'),
                    $request->subject,
                    $request->body
                )
            );

        return redirect()->back();
    }
}
