Devise.setup do |config|
  config.omniauth :facebook, ENV["FACEBOOK_APP_ID"], ENV["FACEBOOK_APP_SECRET"]
  config.mailer_sender = 'mikael@t17.lv'

  require 'devise/orm/active_record'
  config.expire_all_remember_me_on_sign_out = true
  config.sign_out_via = :delete
end
