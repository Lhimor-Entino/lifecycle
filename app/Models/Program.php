<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $with = ['program_programmers','program_testers','step','user_acceptances',"project"];
    
    public function project(){
        return $this->belongsTo(Project::class);
    }

    public function program_programmers(){
        return $this->belongsToMany(User::class,ProgramProgrammer::class);
    }

    public function program_testers(){
        return $this->belongsToMany(User::class,ProgramTester::class);
    }

    public function step(){
        return $this->belongsTo(Step::class);
    }

    // public function business_requirement_document(){
    //     return $this->hasOne(BusReqDoc::class)->where("is_active",0);
    // }
    public function business_requirement_document_item(){
        return $this->hasMany(BusReqDocItem::class);
    }
    public function techinical_requirement_document_item(){
        return $this->hasMany(TeqReqDocItem::class)->where("is_active",0)->latest("created_at");
    }


    // public function business_requirement_document_history(){
    //     return $this->hasMany(BusReqDoc::class)->where("is_active",1);
    // }

    // public function techinical_requirement_document(){

       
    //     return $this->hasOne(TeqReqDoc::class)->latest("created_at");
    // }

    public function program_setup_schedule(){
        return $this->hasOne(ProgramSetupSchedule::class);
    }

    public function user_acceptances(){
        return $this->hasMany(UserAcceptance::class)->where("is_active",0);
    }

    public function change_requests(){
        return $this->hasMany(ChangeRequest::class);
    }
    public function additional_attendees(){
        return $this->hasMany(AttendeesModel::class);
    }
}
