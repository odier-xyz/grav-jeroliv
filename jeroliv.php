<?php
namespace Grav\Theme;

use Grav\Common\Grav;
use Grav\Common\Theme;

class JerOliv extends Quark
{
    public static function getSubscribedEvents()
    {
        $result = parent::getSubscribedEvents();

        $result['onTwigSiteVariables'] = ['onTwigSiteVariables', 0];

        return $result;
    }

    public function onTwigSiteVariables()
    {
        $this->grav['assets']->addJs('theme://js/jquery.feyn.min.js', ['group' => 'bottom']);
        $this->grav['assets']->addJs('theme://js/custom.js', ['group' => 'bottom']);
    }
}
