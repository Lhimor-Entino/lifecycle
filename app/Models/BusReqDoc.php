<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Builder;
// class StatusScope implements Scope
// {
//     public function apply(Builder $builder, Model $model)
//     {
//         $builder->where('is_active', '!=', '1');
//     }
// }

class BusReqDoc extends Model
{
    use HasFactory;
    protected $fillable = ['program_id','user_id','volume','turnaround','accuracy','output_format'];
    protected $with = ['items','user'];
    // protected static function boot()
    // {
    //     parent::boot();

    //     static::addGlobalScope(new StatusScope);
    // }
    public function program(){
        return $this->belongsTo(Program::class);
    }
    public function items(){
        return $this->hasMany(BusReqDocItem::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
