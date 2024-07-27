<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusReqDocItem extends Model
{
    use HasFactory;
    protected $fillable = ['bus_req_doc_id','guid','module','applicable_roles','description'];

    


}
