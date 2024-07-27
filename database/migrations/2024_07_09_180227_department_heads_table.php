<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DepartmentHeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('department_heads',function(Blueprint $table){
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('photo')->nullable();
            $table->string('company_id')->index()->unique();
            $table->string('email')->nullable();            
            $table->string('position')->nullable();            
            $table->string('department')->nullable();
            $table->tinyInteger('level')->default(3);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
            
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('department_heads');
    }
}
