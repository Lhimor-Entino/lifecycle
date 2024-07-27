<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartmentHeadsModel extends Model
{
    use HasFactory;
    protected $table = 'department_heads'; 
    protected $fillable = ["user_id","job_title_id","other_id","last_name","first_name","job_title","job_category","location","work_email","other_email"];
}
