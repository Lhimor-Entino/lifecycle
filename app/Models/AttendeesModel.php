<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendeesModel extends Model
{
    use HasFactory;
    protected $fillable = ['program_id','first_name',
    'last_name',
    'email',
    'position',
    'company_id',
    'department'];
    protected $table = 'additional_attendees'; 
}
