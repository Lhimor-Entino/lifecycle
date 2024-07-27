<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBusReqDocItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bus_req_doc_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bus_req_doc_id')->index();
            $table->string('guid')->index()->nullable();
            $table->string('module');
            $table->string('applicable_roles');
            $table->text('description');

            $table->timestamps();
            $table->foreign('bus_req_doc_id')->references('id')->on('bus_req_docs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bus_req_doc_items');
    }
}
