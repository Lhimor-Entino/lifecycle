<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Auth\HRMSController;
use App\Models\AttendeesModel;
use App\Models\BusReqDoc;
use App\Models\BusReqDocItem;
use App\Models\Department;
use App\Models\DepartmentHeadsModel;
use App\Models\ProgramProgrammer;
use App\Models\ProgramTester;
use App\Models\Project;
use App\Models\Step;
use App\Models\TeqReqDocItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        $projects = [];

        $other_setup_committee_position = ['Assistant Operation Manager', 'QC Supervisor', 'Production Supervisor', 'Operations Manager'];
        $trd_items = [];
        $programIds = [];
        $program_to_check_by_tech = [];
        $access_all_project_user_id =  ["LS50", "J5CS", "LJY6","FOSC"];
        if ($request->user()) {

            $project_ids_1  = ProgramProgrammer::where('user_id', $request->user()->id)->get()->pluck('program_id')->toArray();
            $project_ids_2  = ProgramTester::where('user_id', $request->user()->id)->get()->pluck('program_id')->toArray();

            $ids = array_merge($project_ids_1, $project_ids_2);

            // $user_id = $request->user()->id;
            $company_id = $request->user()->company_id;
     
            $programIdToFind = $project_ids_1;
            $projects = in_array($company_id, $access_all_project_user_id)
                ? Project::with('programs')->where('is_archived', 0)->get()
                :Project::with(['programs' => function ($query) use ($programIdToFind) {
                    $query->whereIn('id', $programIdToFind);
                }])
                ->where('is_archived', 0)
                ->whereHas('programs', function ($query) use ($programIdToFind) {
                    $query->whereIn('id', $programIdToFind);
                })
                ->get();
           
                
            $active_bus_doc_req_ids = BusReqDoc::where("is_active", 0)->get()->pluck('id', 'project_id')->toArray();
            $bus_req_items_id = BusReqDocItem::whereIn('bus_req_doc_id', $active_bus_doc_req_ids)->get()->pluck('id')->toArray();

            $trd_items = TeqReqDocItem::whereIn('bus_req_doc_item_id', $bus_req_items_id)->get()->toArray();

            // Get the IDs of the programs of the first project

            if (count($projects) > 0)  $programIds = $projects[0]->programs->pluck('id');

            $acknowledge_programs = Project::with(['acknowledge_programs'])
                ->where('is_archived', 0)
                ->get();
        }


        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => function () {
                return (new Ziggy)->toArray();
            },
            'projects' => $request->user() ? $projects : [],
            'archives' => $request->user() ? Project::where('is_archived', 1)->get() : [],
            'departments' => $request->user() ? Department::all() : [],
            'users_with_no_email' => $request->user() ? User::where('email', null)->orWhere('email', '')->get() : [],
            'steps' => $request->user() ? Step::all() : [],
            'software_manager' => User::where('company_id', 'LS50')->first(),
            'software_testers' => User::whereIn('company_id', ['J5CS', 'LJY6'])->get(),
            // 'software_manager' => app(HRMSController::class)->get_software_manager(), 
            // 'software_testers' => app(HRMSController::class)->get_system_tester(), 
            'pc_head' => $request->user() ? DepartmentHeadsModel::where('department', $request->user()->department)->get() : [],
            'setup_committee' =>  $request->user() ? DepartmentHeadsModel::whereIn("position", $other_setup_committee_position)->where("department", "FPO")->get() : [],
            'trd_items' => $request->user() ? $trd_items : [],
            'addtional_attendees' => $request->user() ? AttendeesModel::whereIn("program_id", $programIds)->get() : [],
            "acknowledge_programs" => $request->user() ? $acknowledge_programs : []

        ]);
    }
}
