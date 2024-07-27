<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReqTraMasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('req_tra_mas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teq_req_doc_id')->index();
            $table->timestamps();

            $table->foreign('teq_req_doc_id')->references('id')->on('teq_req_docs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('req_tra_mas');
    }
}
