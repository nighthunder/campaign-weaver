<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignMail extends Mailable
{
    use Queueable, SerializesModels;

    public $body;
    public $subject;
    public $fromName;
    public $fromEmail;
    public $subscriber;

    public function __construct($subject, $body, $fromName, $fromEmail, $subscriber = null)
    {
        $this->subject = $subject;
        $this->body = $body;
        $this->fromName = $fromName;
        $this->fromEmail = $fromEmail;
        $this->subscriber = $subscriber;
    }

    public function build()
    {
        return $this->from($this->fromEmail, $this->fromName)
            ->subject($this->subject)
            ->html($this->body);
    }
}
