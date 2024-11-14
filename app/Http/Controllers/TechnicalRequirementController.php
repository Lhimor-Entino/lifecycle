<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Step;
use App\Models\TeqReqDoc;
use App\Models\TeqReqDocItem;
use App\Models\TrdHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TechnicalRequirementController extends Controller
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
        DB::transaction(function () use ($request) {
            $program = Program::findOrFail($request->program_id);
            $trd = TeqReqDoc::create([
                'program_id' => $request->program_id,
                'accuracy' => $request->accuracy,
                'output_format' => $request->output_format,
            ]);

            if ($program->step->id == Step::where('step', '3')->first()->id) {
                $program->update([
                    'step_id' => Step::where('step', '4')->first()->id
                ]);
            }
            TrdHistory::create([
                'teq_req_doc_id' => $trd->id,
                'teq_req_doc_item_id' => null,
                'user_id' => Auth::id(),
                'test_case_status' => 'TRD Created',
            ]);

            $business_requirement_document = $program->business_requirement_document;
            foreach ($business_requirement_document->items as $item) {
                $teq_req_doc_item = TeqReqDocItem::create([
                    'bus_req_doc_item_id' => $item->id,
                    'teq_req_doc_id' => $trd->id,
                    'test_case_description' => "",
                    'test_case_remarks' => "",
                    'test_case_status' => 'On-going',
                ]);
                $test_case_id = 'TRD_TC' . strval($teq_req_doc_item->id);
                $teq_req_doc_item->update([
                    'test_case_id' => $test_case_id,
                ]);
                // TrdHistory::create([
                //     'teq_req_doc_id' => $trd->id,
                //     'teq_req_doc_item_id' => $teq_req_doc_item->id,
                //     'user_id' => Auth::id(),
                //     'test_case_status' => 'TRD Created',
                // ]);
            }
        });


        return redirect()->back();
    }

   // public function create_new_trd_test_case($postData){
        
    public function create_new_trd_test_case(Request $request){

     
        // $data = json_decode($postData,true);
        // dd($data['new_trd_item'][0]['test_case_id']);
        $postData = $request['postData'];
        foreach ($postData['new_trd_item'] as $val){

       
            TeqReqDocItem::create([
                'program_id'=> $postData['program_id'],
                'bus_req_doc_item_id' => $val['bus_req_doc_item_id'],
                'teq_req_doc_id' => $val['teq_req_doc_id'],
                'test_case_description' => null,
                'test_case_remarks' => "",
                "test_case_id" => $val['test_case_id'], 
                'test_case_status' => 'On-going',
            ]);
             TrdHistory::create([
            'teq_req_doc_id' =>$val['teq_req_doc_id'],
            'teq_req_doc_item_id' => $val['id'],
            'user_id' => Auth::id(),
            'test_case_status' => 'New TRD version Created',
            ]);
        }

        //SET TO NOT ACTIVE
        TeqReqDocItem::whereIn('id',$postData['old_trd_item'])->update([
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
    public function update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $trd = TeqReqDoc::findOrFail($id);
            $trd->update([
                'accuracy' => $request->accuracy,
                'output_format' => $request->output_format,
            ]);
            TrdHistory::create([
                'teq_req_doc_id' => $trd->id,
                'teq_req_doc_item_id' => null,
                'user_id' => Auth::id(),
                'test_case_status' => 'Updated Accuracy/Output Format',
            ]);
            
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
        //
    }

    public function item_store(Request $request)
    {

        DB::transaction(function () use ($request) {
            $item = TeqReqDocItem::create([
                'teq_req_doc_id' => $request->teq_req_doc_id,
                'req_description' => $request->req_description,
                //'test_case_id' => $request->test_case_id,
                'test_case_description' => json_encode($request->case_description),
                'test_case_remarks' => $request->test_case_remarks,
                'test_case_status' => $request->test_case_status,
            ]);

            $test_case_id = 'TRD_TC' . strval($item->id);
            $item->update([
                'test_case_id' => $test_case_id,
            ]);

            TrdHistory::create([
                'teq_req_doc_id' => $request->teq_req_doc_id,
                'teq_req_doc_item_id' => $item->id,
                'user_id' => Auth::id(),
                'test_case_status' => $request->test_case_status,
            ]);
        });

      

     return redirect()->back();
    }

    public function item_update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $item = TeqReqDocItem::findOrFail($id);
            $item->update([
                'test_case_description' => $request->case_description,
                'test_case_remarks' => $request->test_case_remarks,
                'test_case_status' => $request->test_case_status,
            ]);

            TrdHistory::create([
                'teq_req_doc_id' => $item->teq_req_doc_id,
                'teq_req_doc_item_id' => $item->id,
                'user_id' => Auth::id(),
                'test_case_status' => $request->test_case_status,
            ]);
        });

        return redirect()->back();
    }


    public function item_destroy($id)
    {
        $item = TeqReqDocItem::findOrFail($id);
        $item->delete();
        return redirect()->back();
    }
}
