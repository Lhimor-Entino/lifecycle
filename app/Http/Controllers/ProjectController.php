<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectCoordinator;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ProjectController extends Controller
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

      
        $project = Project::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'client_name' => $request->client_name
        ]);
        $data = [
            "project_id" => $project->id,
            "volume" => $request->volume,
            "turnaround" => $request->turnaround,
            "accuracy" => $request->accuracy,
            "output_format" => $request->output_format,
        ];
 
        $busReq = app(BusinessRequirementController::class);
    
        $busReq->createBusReqDocs($data,$request->user()->id);
        $coordintors = $request->coordinators;
        foreach ($coordintors as $coordinator) {



            $user = User::firstOrCreate(
                ['company_id' => $coordinator['idno']],
                [
                    'first_name' => $coordinator['first_name'],
                    'last_name' => $coordinator['last_name'],
                    'password' => bcrypt('password'),
                    'position' => $coordinator['job_job_title'],
                    'department' => $coordinator['department'],
                    'email' => $coordinator['work_email'],
                ]
            );

            ProjectCoordinator::create([
                'project_id' => $project->id,
                'user_id' => $user->id
            ]);
        }

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id = 0)
    {
        return Inertia::render('Project', [
            'selected_project' => Project::with(['programs'])->where('id', $id)->firstOrFail(),
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
        $project = Project::findOrFail($id);

        $project->update([
            'name' => $request->name,
            'client_name' => $request->client_name
        ]);

        //delete all coordinators
        $previous_coordinators = ProjectCoordinator::where('project_id', $project->id)->get();
        $previous_coordinators->each(function ($coordinator) {
            $coordinator->delete();
        });

        //replace with new coordinators
        $coordinators = $request->coordinators;
        foreach ($coordinators as $coordinator) {



            $user = User::firstOrCreate(
                ['company_id' => $coordinator['idno']],
                [
                    'first_name' => $coordinator['first_name'],
                    'last_name' => $coordinator['last_name'],
                    'password' => bcrypt('password'),
                    'position' => $coordinator['job_job_title'],
                    'department' => $coordinator['department'],
                    'email' => $coordinator['work_email'],
                ]
            );

            ProjectCoordinator::create([
                'project_id' => $project->id,
                'user_id' => $user->id
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
        $project = Project::findOrFail($id);
        $project->delete();
        return redirect()->route('dashboard');
    }

    public function archive($id)
    {
        $project = Project::findOrFail($id);
        $project->update([
            'is_archived' => 1
        ]);
        return redirect()->back();
    }

    public function restore($id)
    {
        $project = Project::findOrFail($id);
        $project->update([
            'is_archived' => 0
        ]);
        return redirect()->back();
    }

    public function rename(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $project->update([
            'name' => $request->name
        ]);
        return redirect()->back();
    }
}
