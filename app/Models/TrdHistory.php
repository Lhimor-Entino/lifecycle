<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrdHistory extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $with = ['teq_req_doc_item', 'user'];

    public function teq_req_doc(){
        return $this->belongsTo(TeqReqDoc::class);
    }

    public function teq_req_doc_item(){
        return $this->belongsTo(TeqReqDocItem::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
