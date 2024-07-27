<?php

namespace App\Http\Controllers;

use App\Models\BusReqDoc;
use App\Models\ChangeRequest;
use App\Models\User;
use App\Models\UserAcceptance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
class ChangeRequestController extends Controller
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
    public function store(Request $request,$program_id,$bus_req_doc_id)
    {

        $head_exist = User::firstWhere('company_id', $request->head[0]['company_id']);

       
        $sw_head_details = User::firstWhere('company_id', 'LS50');


        if($head_exist){
            $head = User::firstWhere('company_id', $request->head[0]['company_id']);
            // $noted_by = User::firstWhere('company_id', $request->noted_by['idno']);
             $change_request =  ChangeRequest::create([
                        "program_id" => $program_id,
                        "user_id" =>Auth::id(),
                        "title" => $request->title,
                        "description" => $request->description,
                        "client_request" => $request->client_request,
                        "incident_or_problem_resolution" => $request->incident_or_problem_resolution,
                        "enhancement"  => $request->enhancement,
                        "business_requirement"  => $request->business_requirement,
                        "procedural"=> $request->procedural,
                        "others"=> $request->others,                    
                        "others_description" => $request->others_description,   
                        "schedule" => $request->schedule,   
                        "hardware" => $request->hardware,   
                        "software"=> $request->software,   
                        "manpower" => $request->manpower,   
                        "location"  => $request->location,   
                        "office_equipment"  => $request->office_equipment,   
                        "other" => $request->other,   
                        "risk_impact_analysis_people"=> $request->risk_impact_analysis_people,   
                        "risk_impact_analysis_affected_system"=> $request->risk_impact_analysis_affected_system,   
                        "risk_impact_analysis_schedule"=> $request->risk_impact_analysis_schedule,
                        "risk_impact_analysis_equipment"=> $request->risk_impact_analysis_equipment,
                        "risk_impact_analysis_overall_impact"=> $request->risk_impact_analysis_overall_impact,
                        "rollback_plan"=> $request->rollback_plan,
                        "review_result"=> $request->review_result,
                        "reason"=> $request->reason,
                        "head_id" =>$head->id,
                        "review_date" => $request->review_date,
                        "completion_details" => $request->completion_details,
                        "actual_start" => $request->actual_start,
                        "actual_end"=> $request->actual_end,
                        "total_actual_duration"=> $request->total_actual_duration,
                        "remarks"=> $request->remarks,
                        "completed_by_id"=>$request->completed_by['id'],
                        "completed_by_date"=>$request->completed_by_date,
                        "noted_by_id"=>Auth::id(),
                        "noted_by_date"=>$request->noted_by_date,
                        
                    ]);
            Inertia::share('change_request', $change_request);
        }else{

            DB::transaction(function () use ($request,$program_id, $sw_head_details) {
                $head = User::firstOrCreate(
                    ['company_id' => $request->head['idno']],
                    [
                        'first_name' => $request->head['first_name'],
                        'last_name' => $request->head['last_name'],
                        'password' => bcrypt('password'),
                        'position' => $request->head['job_job_title'],
                        'department' => $request->head['department'],
                        'email' => $request->head['work_email'],
                    ]
                );
                    // $noted_by = User::firstWhere('company_id', $request->noted_by['idno']);
             $change_request =  ChangeRequest::create([
                "program_id" => $program_id,
                "user_id" =>Auth::id(),
                "title" => $request->title,
                "description" => $request->description,
                "client_request" => $request->client_request,
                "incident_or_problem_resolution" => $request->incident_or_problem_resolution,
                "enhancement"  => $request->enhancement,
                "business_requirement"  => $request->business_requirement,
                "procedural"=> $request->procedural,
                "others"=> $request->others,                    
                "others_description" => $request->others_description,   
                "schedule" => $request->schedule,   
                "hardware" => $request->hardware,   
                "software"=> $request->software,   
                "manpower" => $request->manpower,   
                "location"  => $request->location,   
                "office_equipment"  => $request->office_equipment,   
                "other" => $request->other,   
                "risk_impact_analysis_people"=> $request->risk_impact_analysis_people,   
                "risk_impact_analysis_affected_system"=> $request->risk_impact_analysis_affected_system,   
                "risk_impact_analysis_schedule"=> $request->risk_impact_analysis_schedule,
                "risk_impact_analysis_equipment"=> $request->risk_impact_analysis_equipment,
                "risk_impact_analysis_overall_impact"=> $request->risk_impact_analysis_overall_impact,
                "rollback_plan"=> $request->rollback_plan,
                "review_result"=> $request->review_result,
                "reason"=> $request->reason,
                "head_id" =>$head->id,
                "review_date" => $request->review_date,
                "completion_details" => $request->completion_details,
                "actual_start" => $request->actual_start,
                "actual_end"=> $request->actual_end,
                "total_actual_duration"=> $request->total_actual_duration,
                "remarks"=> $request->remarks,
                "completed_by_id"=>$sw_head_details->id,
                "completed_by_date"=>$request->completed_by_date,
                "noted_by_id"=>Auth::id(),
                "noted_by_date"=>$request->noted_by_date,      
            ]);

            Inertia::share('change_request', $change_request);

            });
        

        }
        
        //SET CURRENT BRD TO INACTIVE
        BusReqDoc::where("id",$bus_req_doc_id)->update([
            'is_active' => 1
        ]);
        UserAcceptance::where("program_id",$program_id)->update([
            'is_active' => 1
        ]);
    
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
    public function update(Request $request,$program_id)
    {
        //
        $cmr = ChangeRequest::findOrFail($request->id);
        $sw_head_details = User::firstWhere('company_id', 'LS50');
        $complete_by = User::firstWhere('company_id', $request->completed_by['idno']);
        $noted_by = User::firstWhere('company_id', $request->noted_by['idno']);
        $cmr->update([
            "program_id" => $program_id,
            "user_id" =>Auth::id(),
            "title" => $request->title,
            "description" => $request->description,
            "client_request" => $request->client_request,
            "incident_or_problem_resolution" => $request->incident_or_problem_resolution,
            "enhancement"  => $request->enhancement,
            "business_requirement"  => $request->business_requirement,
            "procedural"=> $request->procedural,
            "others"=> $request->others,                    
            "others_description" => $request->others_description,   
            "schedule" => $request->schedule,   
            "hardware" => $request->hardware,   
            "software"=> $request->software,   
            "manpower" => $request->manpower,   
            "location"  => $request->location,   
            "office_equipment"  => $request->office_equipment,   
            "other" => $request->other,   
            "risk_impact_analysis_people"=> $request->risk_impact_analysis_people,   
            "risk_impact_analysis_affected_system"=> $request->risk_impact_analysis_affected_system,   
            "risk_impact_analysis_schedule"=> $request->risk_impact_analysis_schedule,
            "risk_impact_analysis_equipment"=> $request->risk_impact_analysis_equipment,
            "risk_impact_analysis_overall_impact"=> $request->risk_impact_analysis_overall_impact,
            "rollback_plan"=> $request->rollback_plan,
            "review_result"=> $request->review_result,
            "reason"=> $request->reason,
            "head_id" =>$sw_head_details->id,
            "review_date" => $request->review_date,
            "completion_details" => $request->completion_details,
            "actual_start" => $request->actual_start,
            "actual_end"=> $request->actual_end,
            "total_actual_duration"=> $request->total_actual_duration,
            "remarks"=> $request->remarks,
            "completed_by_id"=> $complete_by->id,
            "completed_by_date"=>$request->completed_by_date,
            "noted_by_id"=>$noted_by->id,
            "noted_by_date"=>$request->noted_by_date,
            
          ]);
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
        //

        $item = ChangeRequest::findOrFail($id);
        $item->delete();
        return redirect()->back();
    }
}
