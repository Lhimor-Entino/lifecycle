<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAcceptanceItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_acceptance_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_acceptance_id')->index();
            $table->string('description');
            $table->tinyInteger('status')->default(0);
            $table->tinyInteger('is_additional')->default(0);
            $table->timestamps();

            $table->foreign('user_acceptance_id')->references('id')->on('user_acceptances')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_acceptance_items');
    }
}
