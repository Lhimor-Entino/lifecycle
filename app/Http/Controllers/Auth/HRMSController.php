<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\DepartmentHeadsModel;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class HRMSController extends Controller
{
    public function store(Request $request){
        $company_id=$request->company_id;
        $password=$request->password;



        $response = Http::asForm()->post('idcsi-officesuites.com:8080/hrms/sso.php',[
            'username' => $company_id,
            'password' => $password
        ]);

        if($response['code']!="0"){
            throw ValidationException::withMessages(['company_id'=>$response['message']??'Invalid Credentials']);
        }

        
        
        
        $hrms_response = Http::retry(3, 100)->asForm()->post('idcsi-officesuites.com:8080/hrms/api.php',[
            'idno' => $company_id,
            'what' => 'getinfo',
            'field' => 'personal',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        
        
        $message= $hrms_response['message'];
        $imageContent = file_get_contents($message['picture_location']);
        $location='uploads/photos/user_'.$company_id.'/';
        $path=public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path,0777,true);
        }
        
        File::put(str_replace('/','\\',$path).$company_id,$imageContent,true);
        $user=User::firstOrCreate(
        ['company_id'=>$company_id],
        [
            'first_name'=>$message['first_name'],
            'last_name'=>$message['last_name'],
            'photo'=>$location.$company_id,
            'email'=>$message['work_email'],
            'password'=>bcrypt('password'),
            'position'=>$message['job_job_title'],
            'department'=>$message['project'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    public function sync_departments(){
        $response = Http::retry(3, 100)->asForm()->post('idcsi-officesuites.com:8080/hrms/api.php',[            
            'what' => 'getdepts',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);
        $departments = $response['message'];
        foreach($departments as $department){
            Department::firstOrCreate(['name'=>$department['myValue']]);
        }
        return redirect()->back();
    }

    public function search(string $search=""){

        if(strlen($search)<3) throw ValidationException::withMessages(['search'=>'Search string must be at least 3 characters']);

        $hrms_response = Http::asForm()->post('idcsi-officesuites.com:8080/hrms/api.php',[
            'what' => 'getinfo', 
            'field' => 'fpass',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH', 
            'search' => $search,  
            'idno' => ""
        ]);
        $message= $hrms_response['message'];

        if($hrms_response['code']!="0") return [];

        return $message;
    }

    public function email(Request $request){
        $request->validate([
            'email' => 'required|unique:users|max:255',
        ]);
        $user = User::findOrFail($request->user_id);
        
        $user->update(['email'=>$request->email]);
        return redirect()->back();
    }

    public function get_software_manager(){
        $company_id='LS50';
        $hrms_response = Http::retry(3, 100)->asForm()->post('idcsi-officesuites.com:8080/hrms/api.php',[
            'idno' =>$company_id,
            'what' => 'getinfo',
            'field' => 'personal',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);
        $hrms_response = Http::retry(3, 100)->asForm()->post('idcsi-officesuites.com:8080/hrms/api.php',[
            'idno' => $company_id,
            'what' => 'getinfo',
            'field' => 'personal',
            'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
        ]);

        
        
        $message= $hrms_response['message'];
        $imageContent = file_get_contents($message['picture_location']);
        $location='uploads/photos/user_'.$company_id.'/';
        $path=public_path($location);
        if (!file_exists($path)) {
            File::makeDirectory($path,0777,true);
        }
        
        File::put(str_replace('/','\\',$path).$company_id,$imageContent,true);
        $user=User::firstOrCreate(
        ['company_id'=>$company_id],
        [
            'first_name'=>$message['first_name'],
            'last_name'=>$message['last_name'],
            'photo'=>$location.$company_id,
            'email'=>$message['work_email'],
            'password'=>bcrypt('password'),
            'position'=>$message['job_job_title'],
            'department'=>$message['project'],
        ]);
        return $user;
    }


    public function get_system_tester() {
        $added_users = [];
        $company_ids = ['J5CS','LJY6'];
        $emails = ['system.tester@ddcgroup.asia','Ks.personnel@datacapture2.com.ph'];
        $i = 0;
        foreach ($company_ids as $company_id) {
            $hrms_response = Http::retry(3, 100)->asForm()->post('http://idcsi-officesuites.com:8080/hrms/api.php', [
                'idno' => $company_id,
                'what' => 'getinfo',
                'field' => 'personal',
                'apitoken' => 'IUQ0PAI7AI3D162IOKJH'
            ]);
    
            // Assuming $hrms_response['message'] contains the data
            $message = $hrms_response['message'];
    
            $imageContent = file_get_contents($message['picture_location']);
            $location = 'uploads/photos/user_'.$company_id.'/';
            $path = public_path($location);
    
            if (!file_exists($path)) {
                File::makeDirectory($path, 0777, true);
            }
    
            File::put(str_replace('/', '\\', $path) . $company_id, $imageContent, true);
    
            // Create or update user
            $user = User::updateOrCreate(
                ['company_id' => $company_id],
                [
                    'first_name' => $message['first_name'],
                    'last_name' => $message['last_name'],
                    'photo' => $location . $company_id,
                    'email' =>  $emails[$i],
                    'password' => bcrypt('password'), // Set a default or change as needed
                    'position' => $message['job_job_title'],
                    'department' => $message['project'],
                ]
            );
            
            $i++;
            $added_users[] = $user;
        }
    
        return $added_users;
    }
    
}
