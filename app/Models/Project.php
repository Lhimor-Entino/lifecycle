<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $with = ['user','project_coordinators','business_requirement_document'];

    public function user(){
        return $this->belongsTo(User::class);
    }
   public function business_requirement_document(){
        return $this->hasOne(BusReqDoc::class)->where("is_active",0);
    }
    public function project_coordinators(){
        return $this->belongsToMany(User::class,ProjectCoordinator::class);
    }

    public function programs(){
        return $this->hasMany(Program::class);
    }

    public function acknowledge_programs(){
        return $this->hasMany(Program::class)->where('checked_by_sw_mngr',1);
    }

}
