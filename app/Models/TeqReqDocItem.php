<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeqReqDocItem extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $appends = ['req_description'];

    public function teq_req_doc()
    {
        return $this->belongsTo(TeqReqDoc::class);
    }

    public function bus_req_doc_item()
    {
        return $this->belongsTo(BusReqDocItem::class,'bus_req_doc_item_id');
    }


   
    public function getReqDescriptionAttribute()
    {
        
        return $this->bus_req_doc_item->description;
    }
}
