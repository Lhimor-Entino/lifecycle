<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTrdHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trd_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teq_req_doc_id')->index();
            $table->unsignedBigInteger('teq_req_doc_item_id')->nullable()->index();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('test_case_status');
            $table->timestamps();

            $table->foreign('teq_req_doc_id')->references('id')->on('teq_req_docs')->onDelete('cascade');
            $table->foreign('teq_req_doc_item_id')->references('id')->on('teq_req_doc_items')->onDelete('cascade');
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
        Schema::dropIfExists('trd_histories');
    }
}
