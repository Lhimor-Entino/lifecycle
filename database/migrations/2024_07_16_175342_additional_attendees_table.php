<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AdditionalAttendeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create("additional_attendees", function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('program_id')->index();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('company_id')->index();
            $table->string('email')->unique()->nullable();            
            $table->string('position')->nullable();            
            $table->string('department')->nullable();
            $table->timestamps();
            $table->foreign('program_id')->references('id')->on('programs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::dropIfExists('additional_attendees');
    }
}
