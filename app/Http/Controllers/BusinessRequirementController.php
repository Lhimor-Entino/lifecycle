<?php

namespace App\Http\Controllers;

use App\Models\BusReqDoc;
use App\Models\BusReqDocItem;
use App\Models\Program;
use App\Models\Step;
use App\Models\TeqReqDoc;
use App\Models\TeqReqDocItem;
use App\Models\TrdHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BusinessRequirementController extends Controller
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
    public function createBusReqDocs($data,$user_id)
    {
       
        DB::transaction(function () use ($data,$user_id) {
            // $user = $request->user();
            BusReqDoc::create([
                'project_id' => $data['project_id'],
                'user_id' => $user_id,
                'volume' => $data['volume'],
                'turnaround' => $data['turnaround'],
                'accuracy' => $data['accuracy'],
                'output_format' => $data['output_format'],
            ]);
            TeqReqDoc::create([
                'project_id' => $data['project_id'],
                'accuracy' => $data['accuracy'],
                'output_format' => $data['output_format'],
            ]);
        });

    }
    public function store(Request $request)
    {

        DB::transaction(function () use ($request) {


            $user = $request->user();
            $program = Program::findOrFail($request->program_id);

            $latest_brd = BusReqDoc::where("program_id", $request->program_id)->where("is_active", 1)->latest()->first();
            $latest_trd = TeqReqDoc::where("program_id", $request->program_id)->latest()->first();
            $brd = BusReqDoc::create([
                'program_id' => $request->program_id,
                'user_id' => $user->id,
                'volume' => $request->volume,
                'turnaround' => $request->turnaround,
                'accuracy' => $request->accuracy,
                'output_format' => $request->output_format,
            ]);
            $trd = TeqReqDoc::create([
                'program_id' => $request->program_id,
                'accuracy' => $request->accuracy,
                'output_format' => $request->output_format,
            ]);
            if ($latest_brd) {
                $active_brd_doc_items = BusReqDocItem::where("bus_req_doc_id", $latest_brd->id)->get();
                $active_trd_doc_items = TeqReqDocItem::where("teq_req_doc_id", $latest_trd->id)->where("is_active", 0)->get();
                $bus_item_id = array();
                $i = 0;
                foreach ($active_brd_doc_items as $item) {
                    $brd_item = BusReqDocItem::create([
                        'bus_req_doc_id' => $brd->id,
                        'module' => $item->module,
                        'applicable_roles' => $item->applicable_roles,
                        'description' => $item->description,
                    ]);

                    $bus_item_id[] = $brd_item->id;
                }


                foreach ($active_trd_doc_items as $item) {

                    $trdItems = TeqReqDocItem::create([
                        'teq_req_doc_id' => $trd->id,
                        //    'req_description' => $item->req_description,
                        'test_case_id' => $item->test_case_id,
                        "bus_req_doc_item_id" => $bus_item_id[$i],
                        'test_case_description' => $item->case_description,
                        'test_case_remarks' => $item->test_case_remarks,
                        'test_case_status' => $item->test_case_status,
                    ]);


                    TrdHistory::create([
                        'teq_req_doc_id' => $trd->id,
                        'teq_req_doc_item_id' => $trdItems->id,
                        'user_id' => Auth::id(),
                        'test_case_status' => 'Create TRD ITEM FROM CMR',
                    ]);
                    $i++;
                }
                //    dd($active_trd_doc_items->pluck('id'));

                TeqReqDocItem::whereIn("id", $active_trd_doc_items->pluck("id"))->update([
                    "is_active" => 1
                ]);
            }

            if ($program->step->id == Step::where('step', '1')->first()->id) {
                $program->update([
                    'step_id' => Step::where('step', '2')->first()->id
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
        $bus_req_doc = BusReqDoc::findOrFail($id);
        $bus_req_doc->update([
            'volume' => $request->volume,
            'turnaround' => $request->turnaround,
            'accuracy' => $request->accuracy,
            'output_format' => $request->output_format,
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
    }

    public function item_store(Request $request)
    {


    

        $data = $request->all();
        $items = json_decode($data['items'], true); // Decode the JSON string into PHP array

        DB::transaction(function () use ($request, $items) {

            foreach ($items as $dt) {

                $bus_req_item = BusReqDocItem::create([
                    'program_id' =>$request['program_id'],
                    'bus_req_doc_id' => $dt['bus_req_doc_id'],
                    'module' => $dt['module'],
                    'applicable_roles' => $dt['applicable_roles'],
                    'description' => $dt['description'],
                ]);
     
                $teq_req_doc = TeqReqDoc::where('project_id',$request['project_id'])->latest("created_at")->first();
                if ($teq_req_doc) {
                    $item = TeqReqDocItem::create([
                        'teq_req_doc_id' => $teq_req_doc->id,
                        'program_id' =>$request['program_id'],
                        'bus_req_doc_item_id' => $bus_req_item->id,
                    ]);
                    $test_case_id = 'TRD_TC' . strval($item->id);
                    $item->update([
                        'test_case_id' => $test_case_id,
                    ]);

                    TrdHistory::create([
                        'teq_req_doc_id' => $item->teq_req_doc_id,
                        'teq_req_doc_item_id' => $item->id,
                        'user_id' => Auth::id(),
                        'test_case_status' => 'Item Added to TRD',
                    ]);
                }
            }
        });


        return redirect()->back();
    }


    public function item_destroy($id)
    {
        $item = BusReqDocItem::findOrFail($id);
        $item->delete();
        return redirect()->back();
    }
}
