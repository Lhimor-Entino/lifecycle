<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\HRMSController;
use App\Http\Controllers\BusinessRequirementController;
use App\Http\Controllers\ChangeRequestController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TechnicalRequirementController;
use App\Http\Controllers\UserAcceptanceController;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    
    
    
    Route::prefix('projects')->name('projects.')->group(function(){
        Route::post('/store', [ProjectController::class,'store'])->name('store');
        Route::get('/show/{id?}', [ProjectController::class,'show'])->name('show');
        Route::post('/update/{id}', [ProjectController::class,'update'])->name('update');        
        Route::post('/archive/{id}', [ProjectController::class,'archive'])->name('archive');       
        Route::post('/restore/{id}', [ProjectController::class,'restore'])->name('restore');       
        Route::post('/destroy/{id}', [ProjectController::class,'destroy'])->name('destroy');      
        Route::post('/rename/{id}', [ProjectController::class,'rename'])->name('rename');
    });

    Route::prefix('programs')->name('programs.')->group(function(){
        Route::get('/show/{id}', [ProgramController::class,'show'])->name('show');
        Route::post('/store', [ProgramController::class,'store'])->name('store');
        Route::post('/new', [ProgramController::class,'new'])->name('new');
        Route::post('/update/{id}', [ProgramController::class,'update'])->name('update');
        Route::post('/destroy/{id}', [ProgramController::class,'destroy'])->name('destroy');
        Route::post('/next_step/{id}', [ProgramController::class,'next_step'])->name('next_step');
        Route::get('/acknowledge/{id}', [ProgramController::class,'acknowledge'])->name('acknowledge');
        
        Route::post('/setup_sched', [ProgramController::class,'setup_sched'])->name('setup_sched');

        Route::get('/faceSwap', [ProgramController::class,'faceSwap'])->name('faceSwap');


        //Email routes below:        
        Route::post('/trd_notif', [ProgramController::class,'trd_notif'])->name('trd_notif');
        Route::post('/notify_setup_comitee', [ProgramController::class,'notify_setup_comitee'])->name('notify_setup_comitee');        
        Route::post('/setup_sched_reminder', [ProgramController::class,'setup_sched_reminder'])->name('setup_sched_reminder');   
        Route::post('/test_plan_email_notif', [ProgramController::class,'test_plan_email_notif'])->name('test_plan_email_notif');        
        Route::post('/failed_test', [ProgramController::class,'failed_test'])->name('failed_test');
        Route::post('/completed_test', [ProgramController::class,'completed_test'])->name('completed_test');
        Route::post('/test_cases_passed', [ProgramController::class,'test_cases_passed'])->name('test_cases_passed');
        Route::post('/change_request', [ProgramController::class,'change_request'])->name('change_request');

        // //VALIDATION
        
        // Route::post('/check_attendees_exist', [ProgramController::class,'check_attendees_exist'])->name('check_attendees_exist');

    });

    Route::prefix('business_requirement')->name('business_requirement.')->group(function(){
        Route::post('/store', [BusinessRequirementController::class,'store'])->name('store');
        Route::post('/update/{id}', [BusinessRequirementController::class,'update'])->name('update');
        Route::post('/item/store', [BusinessRequirementController::class,'item_store'])->name('item.store');
        Route::post('/item/destroy/{id}', [BusinessRequirementController::class,'item_destroy'])->name('item.destroy');
    });

    Route::prefix('tech_requirement')->name('tech_requirement.')->group(function(){
        Route::post('/store', [TechnicalRequirementController::class,'store'])->name('store');
        Route::post('/update/{id}', [TechnicalRequirementController::class,'update'])->name('update');
        Route::post('/create_new_trd_test_case/{postData}', [TechnicalRequirementController::class,'create_new_trd_test_case'])->name('create_new_trd_test_case');
        Route::post('/item/store', [TechnicalRequirementController::class,'item_store'])->name('item.store');
        Route::post('/item/update/{id}', [TechnicalRequirementController::class,'item_update'])->name('item.update');
        Route::post('/item/destroy/{id}', [TechnicalRequirementController::class,'item_destroy'])->name('item.destroy');
   
    });

    Route::prefix('user_acceptance')->name('user_acceptance.')->group(function(){
        Route::post('/store', [UserAcceptanceController::class,'store'])->name('store');
        Route::post('/update/{id}', [UserAcceptanceController::class,'update'])->name('update');
        Route::post('/destroy/{id}', [UserAcceptanceController::class,'destroy'])->name('destroy');
        Route::post('/failed_test', [UserAcceptanceController::class,'failed_test'])->name('failed_test');
    });
    
    Route::prefix('hrms')->name('hrms.')->group(function () {
        Route::get('/sync_departments', [HRMSController::class,'sync_departments'])->name('sync_departments');
        Route::get('/search/{search?}', [HRMSController::class,'search'])->name('search');
        Route::post('/email', [HRMSController::class,'email'])->name('email');
        Route::get('/manager', [HRMSController::class,'get_software_manager'])->name('manager');
    });

    Route::prefix('changeMngt')->name('changeMngt.')->group(function () {
        Route::post('/store/{program_id}{bus_req_doc_id}', [ChangeRequestController::class,'store'])->name('store');
        Route::post('/update/{program_id}', [ChangeRequestController::class,'update'])->name('update');
        Route::post('/destroy/{id}', [ChangeRequestController::class,'destroy'])->name('destroy');
    });
    
    
});




Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
                ->name('login');

    Route::post('login', [HRMSController::class, 'store']);
});


Route::get('/search/{search?}', [HRMSController::class,'search'])->name('search');



Route::get('/public', function () {
    return null;
})->name('public_route');

Route::get('/resync',function(){
    $users = User::where('email',null)->get();
    foreach($users as $user){
        $hrms_response = Http::asForm()->post('idcsi-officesuites.com:8080/hrms/api.php',[
            'idno' => strval($user['company_id']),
            'what' => 'getinfo',
            'field' => 'personal',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        
        
        $message= $hrms_response['message'];
        $user->update(['email'=>strlen($message['work_email'])>2?$message['work_email']:null]);
        sleep(5);
    }
    return 'resynced';
})->name('resync');

