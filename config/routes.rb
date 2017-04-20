Rails.application.routes.draw do
  devise_for :users, controllers: { :omniauth_callbacks => "users/omniauth_callbacks" }
  devise_scope :user do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end
  
  root 'home#index'
  
  resources :projects do
    resources :posts, shallow: true do
      resources :comments, shallow: true
    end
  end

  post 'like/:post_id', to: "posts#like", as: :like_post
  
  get 'administer', :to => 'administration#index', :as => :administer
  post 'administer', :to => 'administration#save'
  get 'invite', :to => 'administration#invite', :as => :invite
  post 'make-admin/:user_id', :to => 'administration#make_admin', :as => :make_admin
end
