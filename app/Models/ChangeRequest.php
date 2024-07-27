<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChangeRequest extends Model
{
    
    use HasFactory;
    protected $guarded=[];
    protected $with = ['user','head','completed_by','noted_by'];
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function head(){
        return $this->belongsTo(User::class,'head_id');
    }
    public function completed_by(){
        return $this->belongsTo(User::class,'completed_by_id');
    }
    public function noted_by(){
        return $this->belongsTo(User::class,'noted_by_id');
    }


}
