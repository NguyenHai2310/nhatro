class RegistrationsController < Devise::RegistrationsController
  private
  def account_update_params
    params.require(:user).permit User::PARAMS_ATTRIBUTES
  end

  def update_resource(resource, params)
    resource.update_without_password(params)
  end
end
