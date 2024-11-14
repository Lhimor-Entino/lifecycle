<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeqReqDocItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('teq_req_doc_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teq_req_doc_id')->index();
            $table->unsignedBigInteger('bus_req_doc_item_id')->index('brd_item_id');
            $table->unsignedBigInteger('program_id')->index();
            //$table->string('req_description'); to be appended to Model by Laravel Accessors using $appends
            $table->string('test_case_id')->index()->nullable();
            $table->text('test_case_description')->nullable();
            $table->string('test_case_remarks')->nullable();
            $table->string('test_case_status')->nullable();
            $table->tinyInteger('is_active')->default(0); // 0 IS ACTIVE
            $table->timestamps();

            $table->foreign('teq_req_doc_id')->references('id')->on('teq_req_docs')->onDelete('cascade');     
            $table->foreign('bus_req_doc_item_id', 'brd_item_id')->references('id')->on('bus_req_doc_items')->onDelete('cascade');       
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
        Schema::dropIfExists('teq_req_doc_items');
    }
}
