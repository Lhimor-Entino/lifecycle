<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAcceptance extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $with = ['items','user'];

    public function items()
    {
        return $this->hasMany(UserAcceptanceItem::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
}
