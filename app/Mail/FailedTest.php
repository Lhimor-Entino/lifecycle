<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FailedTest extends Mailable
{
    use Queueable, SerializesModels;
    public string $name;
    public string $subject_line;
    public string $email;
    public string $body;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($name,$email,$subject,$body)
    {
        $this->name=$name;
        $this->email=$email;
        $this->body =$body;
        $this->subject_line =$subject;
    }
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->subject_line)->view('emails.trd_notification');
    }
}
