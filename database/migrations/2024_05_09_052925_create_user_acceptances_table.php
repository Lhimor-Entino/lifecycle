<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAcceptancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_acceptances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('responsible');            
            $table->text('remarks')->nullable();
            $table->tinyInteger('is_active')->default(0); // 0 is active 1 is inactive
            $table->timestamps();

            $table->foreign('program_id')->references('id')->on('programs')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_acceptances');
    }
}
