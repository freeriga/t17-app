require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module T17App
  class Application < Rails::Application
    config.time_zone = "Riga"
    config.assets << Gemojione.images_path
    config.assets.precompile << "emoji/*.png"
  end
end
