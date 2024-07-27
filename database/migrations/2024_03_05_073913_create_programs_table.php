<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id')->index();
            
            $table->unsignedBigInteger('step_id')->index()->nullable();
            $table->string('name');
            $table->string('department')->nullable();
            $table->date('date_prepared')->nullable();
            $table->string('scope_of_testing')->nullable(); 
            $table->string('test_strategy')->nullable();
            $table->date('testing_schedule')->nullable();
            $table->string('resources_needed')->nullable();            
            $table->date('system_deadline')->nullable();
            $table->tinyInteger("checked_by_sw_mngr")->default(0); // 0 is NO 1 YES
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('step_id')->references('id')->on('steps')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('programs');
    }
}
